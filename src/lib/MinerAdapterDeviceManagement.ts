import {
    ACTIONS,
    DeviceManagement,
    type ConfigItemAny,
    type ActionContext,
    type ControlState,
    type DeviceControl,
    type DeviceDetails,
    type DeviceLoadContext,
    type DeviceRefresh,
    type InstanceDetails,
    type JsonFormData,
} from '@iobroker/dm-utils';
import { I18n } from '@iobroker/adapter-core';
import type { MinerAdapter } from '../main';
import { categoryKeys } from './miner/model/Category';
import type {
    AvalonMinerSettings,
    BOSSettings,
    BOSMinerSettings,
    ClaymoreMinerSettings,
    IceRiverOcMinerSettings,
    MinerSettings,
    PollingMinerSettings,
    CGMinerSettings,
    TeamRedMinerSettings,
    XMRigSettings,
} from './miner/model/MinerSettings';
import { BOS_DEFAULT_PASSWORD, BOS_DEFAULT_USERNAME, minerTypeKeys } from './miner/model/MinerSettings';
import type {
    IOBrokerDeviceSettings,
    IOBrokerKnownDeviceSettings,
    IOBrokerMinerSettings,
    IOBrokerPoolSettings,
} from '../miner/model/IOBrokerMinerSettings';
import { decryptDeviceSettings, isMiner, isPool } from '../miner/model/IOBrokerMinerSettings';
import { poolTypeKeys, type BraiinsPoolSettings, type PoolType } from './miner/model/PoolSettings';
import { createPool } from './miner/pool/PoolFactory';
import { BRAIINS_POOL_DEFAULT_POLL_INTERVAL_MS, BRAIINS_POOL_MIN_POLL_INTERVAL_MS } from './miner/pool/BraiinsPool';
import { PoolFeatureKey } from './miner/model/PoolFeature';
import { formatHashrate } from './utils/hashrate-utils';
import type { PartialDeep } from 'type-fest';
import { createMiner } from './miner/miner/MinerFactory';
import { getMinerFeatureFullId, MinerFeatureKey } from './miner/model/MinerFeature';
import { describeUpdateStatus } from './update/updateStatus';
import { DEFAULT_FILTER_CLEAN_INTERVAL_DAYS } from './miner/model/FilterStatus';
import { AvalonMiner } from './miner/miner/AvalonMiner';
import { isWrongPasswordError } from './miner/api/AvalonWebLogin';
import type { Miner } from './miner/miner/Miner';
import { CUSTOM_CHANNEL, resolveCustomFeatures, type CustomFeatureDefinition } from './miner/model/CustomFeature';

/**
 * How long a slider, color or text control waits for the user to stop changing it before sending the value: each
 * value sent reconfigures the miner.
 */
const CONTROL_DELAY_MS = 500;

/**
 * Like `I18n.getTranslatedObject(key, ...args)`, but fills every `%s`: adapter-core only fills the first one
 * (with the last argument) when given several arguments.
 *
 * @param key - translation key containing one `%s` per argument
 * @param args - values for the placeholders, in order
 * @returns the message in all available languages
 */
function translateWithArgs(key: string, ...args: (string | number)[]): ioBroker.Translated {
    const template = I18n.getTranslatedObject(key);
    return Object.fromEntries(
        Object.entries(template).map(([lang, text]) => [
            lang,
            args.reduce<string>((message, arg) => message.replace('%s', String(arg)), text),
        ]),
    ) as ioBroker.Translated;
}

/**
 *
 */
class MinerAdapterDeviceManagement extends DeviceManagement<MinerAdapter> {
    /**
     *
     */
    async getInstanceInfo(): Promise<InstanceDetails> {
        const baseInfo = await super.getInstanceInfo();
        const data = {
            ...baseInfo,
            apiVersion: 'v3' as const,
            actions: [
                {
                    id: 'newDevice',
                    title: '',
                    description: I18n.getTranslatedObject('Add new device to Miner'),
                    handler: this.handleNewDevice.bind(this),
                },
                {
                    id: 'checkForUpdates',
                    icon: 'update',
                    title: '',
                    description: I18n.getTranslatedObject('Check miners for updates'),
                    handler: this.handleCheckForUpdates.bind(this),
                },
                // TODO
                /*{
                    id: 'discover',
                    icon: 'fas fa-search',
                    title: '',
                    description: {
                        en: 'Discover new devices',
                        de: 'Neue Geräte suchen',
                        ru: 'Обнаружить новые устройства',
                        pt: 'Descubra novos dispositivos',
                        nl: 'Ontdek nieuwe apparaten',
                        fr: 'Découvrir de nouveaux appareils',
                        it: 'Scopri nuovi dispositivi',
                        es: 'Descubrir nuevos dispositivos',
                        pl: 'Odkryj nowe urządzenia',
                        'zh-cn': '发现新设备',
                        uk: 'Виявити нові пристрої'
                    },
                    handler: this.handleDiscover.bind(this)
                }*/
            ],
        };
        return data;
    }

    /**
     * Checks all running miners for updates right away, asking the upstream sources again instead of using
     * cached results, and reports the outcome.
     *
     * @param context - the action context for showing messages
     */
    async handleCheckForUpdates(context: ActionContext): Promise<{ refresh: boolean }> {
        const summary = await this.adapter.checkForUpdates({ force: true });
        await context.showMessage(
            translateWithArgs(
                'Update check finished: %s miner(s) checked, %s with an update available, %s failed',
                summary.checked,
                summary.updatesAvailable,
                summary.failed,
            ),
        );
        return { refresh: true };
    }

    /**
     * Shows the new device form and adds the device.
     *
     * @param context - the action context for showing forms and messages
     */
    async handleNewDevice(context: ActionContext): Promise<{ refresh: boolean }> {
        this.adapter.log.info('handleNewDevice');

        const settings = await this.showDeviceConfigurationForm(
            context,
            {
                category: 'miner',
                settings: {
                    minerType: undefined,
                    id: crypto.randomUUID(),
                    host: '',
                    pollInterval: this.adapter.config.pollInterval,
                    claymore: {
                        minerType: 'claymoreMiner',
                        host: '',
                        password: crypto.randomUUID(),
                        port: 3333,
                    },
                    cgminer: {
                        minerType: 'cgMiner',
                        host: '',
                        port: 4028,
                    },
                },
                name: '',
                mac: '',
                enabled: true,
            } as PartialDeep<IOBrokerMinerSettings>,
            // TODO: improve this (by making IOBrokerMinerSettings generic?, ...)
            I18n.getTranslatedObject('Add new device'),
            true,
        );

        if (settings === undefined) {
            return { refresh: false };
        }

        await this.adapter.addDevice(settings);

        return { refresh: true };
    }

    private async showDeviceConfigurationForm(
        context: ActionContext,
        existingSettings: PartialDeep<IOBrokerKnownDeviceSettings>,
        title: ioBroker.StringOrTranslated,
        isNew = false,
    ): Promise<IOBrokerKnownDeviceSettings | undefined> {
        // TODO: re-open form with filled in values if something is missing after showing validation result
        // basically recursive call with existingSettings = return value of this function

        if (!isMiner(existingSettings) && !isPool(existingSettings)) {
            this.adapter.log.error(
                `MinerAdapterDeviceManagement/showDeviceConfigurationForm category ${existingSettings.category} is not supported.`,
            );
            return undefined;
        }

        const existingMiner = isMiner(existingSettings) ? existingSettings : undefined;
        const existingPool = isPool(existingSettings) ? existingSettings : undefined;

        const result: JsonFormData | undefined = await context.showForm(
            {
                type: 'panel',
                items: {
                    category: {
                        type: 'select',
                        format: 'dropdown',
                        newLine: true,
                        label: I18n.getTranslatedObject('Category'),
                        tooltip:
                            'category of the device: a miner (hardware / mining software) or a pool account. Can not be changed later.',
                        // a device keeps its category: miners and pools have different states
                        disabled: !isNew,
                        options: categoryKeys.map(key => {
                            return {
                                value: key,
                                label: I18n.getTranslatedObject(key === 'pool' ? 'Pool' : 'Miner'),
                            };
                        }),
                    },
                    poolType: {
                        type: 'select',
                        format: 'dropdown',
                        newLine: true,
                        label: I18n.getTranslatedObject('Pool'),
                        tooltip: 'the mining pool the account belongs to',
                        hidden: "data.category !== 'pool'",
                        options: poolTypeKeys.map(key => ({ value: key, label: getPoolTypeLabel(key) })),
                    },
                    minerType: {
                        type: 'select',
                        format: 'dropdown',
                        newLine: true,
                        label: I18n.getTranslatedObject('Miner type'),
                        tooltip: 'type of miner / firmware',
                        hidden: "data.category !== 'miner'",
                        options: minerTypeKeys.map(key => {
                            return {
                                value: key,
                                // TODO: translate(key)
                                label: key,
                            };
                        }),
                    },
                    id: {
                        type: 'text',
                        newLine: true,
                        label: I18n.getTranslatedObject('id'),
                        tooltip: 'unique id of the device, used to identify the device in the adapter',
                        readOnly: true,
                        noClearButton: true,
                        disabled: true,
                    },
                    name: {
                        type: 'text',
                        newLine: true,
                        // trim: false,
                        label: I18n.getTranslatedObject('Name'),
                        tooltip: 'name for the user to identify the device',
                    },
                    apiToken: {
                        type: 'password',
                        newLine: true,
                        label: I18n.getTranslatedObject('API token'),
                        help: I18n.getTranslatedObject(
                            'Braiins Pool: Settings → Access Profiles: create a profile with web API access and generate a token.',
                        ),
                        tooltip:
                            'access token of the pool API. Read-only access is enough: the adapter only reads statistics.',
                        hidden: "data.category !== 'pool'",
                    },
                    poolPollInterval: {
                        type: 'number',
                        newLine: true,
                        min: BRAIINS_POOL_MIN_POLL_INTERVAL_MS,
                        label: I18n.getTranslatedObject('poll interval'),
                        tooltip: `interval to poll the pool API for new data (in ms). The pool updates its statistics about once a minute and limits API requests, so at least ${BRAIINS_POOL_MIN_POLL_INTERVAL_MS} ms.`,
                        hidden: "data.category !== 'pool'",
                    },
                    host: {
                        type: 'text',
                        newLine: true,
                        trim: true,
                        placeholder: 'fe80::42',
                        label: I18n.getTranslatedObject('IP address'),
                        tooltip: 'IP address (or host) of the device',
                        hidden: "data.category !== 'miner'",
                    },
                    // TODO: get by request
                    mac: {
                        type: 'text',
                        newLine: true,
                        trim: true,
                        placeholder: '00:00:00:00:00:00',
                        label: I18n.getTranslatedObject('MAC address'),
                        tooltip: 'MAC address of the device',
                        hidden: "data.category !== 'miner'",
                    },
                    // TODO: show only if miner requires polling? possible to dynamically add fields to form?
                    pollInterval: {
                        type: 'number',
                        newLine: true,
                        min: 100,
                        label: I18n.getTranslatedObject('poll interval'),
                        tooltip: 'interval to poll the device for new data (in ms)',
                        hidden: "data.category !== 'miner'",
                    },
                    username: {
                        type: 'text',
                        newLine: true,
                        trim: true,
                        label: I18n.getTranslatedObject('username'),
                        tooltip: 'username used to login to the device API',
                        hidden: "data.category !== 'miner' || !(data.minerType == 'bos' || data.minerType == 'bosMiner')",
                    },
                    password: {
                        type: 'text',
                        // type password does not allow to show the password generated as default value
                        // type: 'password',
                        newLine: true,
                        label: I18n.getTranslatedObject('password'),
                        tooltip:
                            'password used to connect to the device api. Adapter generates a random, secure and unique one for each device by default. But can of course be changed if needed.',
                        hidden: "data.category !== 'miner' || !(data.minerType == 'claymoreMiner' || data.minerType == 'xmRig' || data.minerType == 'iceRiverOcMiner' || data.minerType == 'teamRedMiner' || data.minerType == 'bos' || data.minerType == 'bosMiner')", // TODO: improve this
                    },
                    webPassword: {
                        type: 'password',
                        newLine: true,
                        label: I18n.getTranslatedObject('web password'),
                        help: I18n.getTranslatedObject('Default web password: admin.'),
                        tooltip:
                            'password of the miner web interface, as set in the Avalon Family app. Only needed for the "Approve web login" action, which logs a browser in without scanning the QR code.',
                        hidden: "data.category !== 'miner' || data.minerType != 'avalonMiner'",
                    },
                    filterCleanIntervalDays: {
                        type: 'number',
                        newLine: true,
                        min: 0,
                        step: 1,
                        label: I18n.getTranslatedObject('filter cleaning reminder (days)'),
                        help: I18n.getTranslatedObject(
                            'Days of filter runtime until the reminder to clean the dust filter. 0 = off.',
                        ),
                        tooltip:
                            'after this many days of filter runtime the adapter sets custom.filter.cleanDue and raises a notification. Reset the reminder after cleaning the filter.',
                        hidden: "data.category !== 'miner' || data.minerType != 'avalonMiner'",
                    },
                    enabled: {
                        type: 'checkbox',
                        newLine: true,
                        label: I18n.getTranslatedObject('enabled'),
                        tooltip:
                            'whether the device is enabled or not. Disabled devices will do nothing (not get polled, control does not work, ...). Useful if you f.e. shut one off temporarily.',
                    },
                },
            },
            {
                data: {
                    category: existingSettings.category,
                    id: existingSettings.settings?.id,
                    name: existingSettings.name,
                    enabled: existingSettings.enabled,
                    // miner
                    minerType: existingMiner?.settings?.minerType,
                    host: existingMiner?.settings?.host ?? '',
                    mac: existingMiner?.mac ?? '',
                    pollInterval: (existingMiner?.settings as PartialDeep<PollingMinerSettings>)?.pollInterval ?? 10000, // TODO: implement this properly
                    username: (existingMiner?.settings as PartialDeep<BOSSettings>)?.username ?? BOS_DEFAULT_USERNAME, // TODO: implement this properly
                    password: existingMiner ? getPasswordFormValue(existingMiner) : '', // TODO: implement this properly
                    webPassword: (existingMiner?.settings as PartialDeep<AvalonMinerSettings>)?.webPassword ?? '',
                    filterCleanIntervalDays:
                        (existingMiner?.settings as PartialDeep<AvalonMinerSettings>)?.filterCleanIntervalDays ??
                        DEFAULT_FILTER_CLEAN_INTERVAL_DAYS,
                    // pool
                    poolType: existingPool?.settings?.poolType ?? poolTypeKeys[0],
                    apiToken: (existingPool?.settings as PartialDeep<BraiinsPoolSettings>)?.apiToken ?? '',
                    poolPollInterval: existingPool?.settings?.pollInterval ?? BRAIINS_POOL_DEFAULT_POLL_INTERVAL_MS,
                },
                title,
            },
        );

        if (result === null || result === undefined) {
            return undefined;
        }

        if (isPool({ category: result.category })) {
            return this.toPoolSettings(context, result);
        }

        // TODO: check category && minerType

        // Check if mac was entered
        // TODO: get from device
        if (result.mac === '') {
            await context.showMessage(I18n.translate('MAC address required'));
        }

        // Check if mac is valid
        if (result.mac !== '') {
            // Check mac has the right format
            /*if (!result.mac.match(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)) {
                await context.showMessage(`MAC address ${result.mac} is not valid`);
                // TODO: Objects are not valid as a React child (found: object with keys {en, de, ru, pt, nl, fr, it, es, pl, zh-cn, uk}). If you meant to render a collection of children, use an array instead.
                // await context.showMessage({
                //     en: `MAC address ${result.mac} is not valid`,
                //     de: `MAC-Adresse ${result.mac} ist ungültig`,
                //     ru: `MAC адрес ${result.mac} недействителен`,
                //     pt: `Endereço MAC ${result.mac} não é válido`,
                //     nl: `MAC-adres ${result.mac} is ongeldig`,
                //     fr: `L'adresse MAC ${result.mac} n'est pas valide`,
                //     it: `L'indirizzo MAC ${result.mac} non è valido`,
                //     es: `La dirección MAC ${result.mac} no es válida`,
                //     pl: `Adres MAC ${result.mac} jest nieprawidłowy`,
                //     'zh-cn': `MAC地址 ${result.mac} 无效`,
                //     uk: `MAC адреса ${result.mac} недійсна`
                // });
                return undefined;
            }*/
        }
        // Check if host/ip was entered
        if (result.host === '') {
            // TODO: Objects are not valid as a React child (found: object with keys {en, de, ru, pt, nl, fr, it, es, pl, zh-cn, uk}). If you meant to render a collection of children, use an array instead.
            await context.showMessage(I18n.translate('Please enter an IP address'));
            // await context.showMessage({
            //     en: `Please enter an IP address`,
            //     de: `Bitte geben Sie eine IP-Adresse ein`,
            //     ru: `Пожалуйста, введите IP адрес`,
            //     pt: `Por favor, digite um endereço de IP`,
            //     nl: `Voer een IP-adres in`,
            //     fr: `Veuillez saisir une adresse IP`,
            //     it: `Inserisci un indirizzo IP`,
            //     es: `Por favor ingrese una dirección IP`,
            //     pl: `Proszę wprowadzić adres IP`,
            //     'zh-cn': `请输入IP地址`,
            //     uk: `Будь ласка, введіть IP адресу`
            // });
            return undefined;
        }
        // Check if ip is valid
        if (result.host !== '') {
            // Check ip has the right format
            // TODO: fix this check
            /*if (!result.host.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
                // TODO: Objects are not valid as a React child (found: object with keys {en, de, ru, pt, nl, fr, it, es, pl, zh-cn, uk}). If you meant to render a collection of children, use an array instead.
                await context.showMessage(`IP address ${result?.ip} is not valid`);
                // await context.showMessage({
                //     en: `IP address ${result.ip} is not valid`,
                //     de: `IP-Adresse ${result.ip} ist ungültig`,
                //     ru: `IP адрес ${result.ip} недействителен`,
                //     pt: `Endereço de IP ${result.ip} não é válido`,
                //     nl: `IP-adres ${result.ip} is ongeldig`,
                //     fr: `L'adresse IP ${result.ip} n'est pas valide`,
                //     it: `L'indirizzo IP ${result.ip} non è valido`,
                //     es: `La dirección IP ${result.ip} no es válida`,
                //     pl: `Adres IP ${result.ip} jest nieprawidłowy`,
                //     'zh-cn': `IP地址 ${result.ip} 无效`,
                //     uk: `IP адреса ${result.ip} недійсна`
                // });
                return undefined;
            }*/
        }

        if (!isMiner({ category: result.category })) {
            // TODO: pool support
            this.log.error(
                `MinerAdapterDeviceManagement/handleNewDevice category ${result.category} is not yet supported.`,
            );
            return undefined;
        }

        let minerSettings: MinerSettings = {
            id: result.id,
            minerType: result.minerType,
            host: result.host,
        };

        switch (minerSettings.minerType) {
            case 'teamRedMiner': {
                // TODO: allow to be left empty => always use interval from adapter config
                const pollInterval = result.pollInterval ?? this.adapter.config.pollInterval;

                const trmSettings: Omit<TeamRedMinerSettings, keyof MinerSettings> = {
                    pollInterval,
                    claymore: {
                        minerType: 'claymoreMiner',
                        pollInterval,
                        host: minerSettings.host,
                        password: result.password,
                        port: 3333, // TODO: make configurable
                    },
                    cgminer: {
                        minerType: 'cgMiner',
                        pollInterval,
                        host: minerSettings.host,
                        port: 4028, // TODO: make configurable
                    },
                };
                minerSettings = {
                    ...minerSettings,
                    ...trmSettings,
                };
                break;
            }

            case 'claymoreMiner': {
                const pollInterval = result.pollInterval ?? this.adapter.config.pollInterval;

                const claymoreSettings: Omit<ClaymoreMinerSettings, keyof MinerSettings> = {
                    pollInterval,
                    port: 3333, // TODO: make configurable
                    password: result.password,
                };
                minerSettings = {
                    ...minerSettings,
                    ...claymoreSettings,
                };
                break;
            }

            case 'cgMiner': {
                const pollInterval = result.pollInterval ?? this.adapter.config.pollInterval;

                const cgSettings: Omit<CGMinerSettings, keyof MinerSettings> = {
                    pollInterval,
                    port: 4028, // TODO: make configurable
                };
                minerSettings = {
                    ...minerSettings,
                    ...cgSettings,
                };
                break;
            }

            case 'xmRig': {
                const pollInterval = result.pollInterval ?? this.adapter.config.pollInterval;

                const xmRigSettings: Omit<XMRigSettings, keyof MinerSettings> = {
                    pollInterval,
                    port: 8420, // TODO: make configurable
                    password: result.password,
                };
                minerSettings = {
                    ...minerSettings,
                    ...xmRigSettings,
                };
                break;
            }

            case 'iceRiverOcMiner': {
                const pollInterval = result.pollInterval ?? this.adapter.config.pollInterval;

                const iceRiverOcSettings: Omit<IceRiverOcMinerSettings, keyof MinerSettings> = {
                    pollInterval,
                    port: 443, // TODO: make configurable
                    password: result.password,
                };
                minerSettings = {
                    ...minerSettings,
                    ...iceRiverOcSettings,
                };
                break;
            }

            case 'bosMiner': {
                const pollInterval = result.pollInterval ?? this.adapter.config.pollInterval;

                const bosSettings: Omit<BOSMinerSettings, keyof MinerSettings> = {
                    pollInterval,
                    port: 4028, // TODO: make configurable
                    sshPort: 22,
                    username: result.username ?? BOS_DEFAULT_USERNAME,
                    password: result.password ?? BOS_DEFAULT_PASSWORD,
                };
                minerSettings = {
                    ...minerSettings,
                    ...bosSettings,
                };
                break;
            }

            case 'bos': {
                const pollInterval = result.pollInterval ?? this.adapter.config.pollInterval;

                const bosSettings: Omit<BOSSettings, keyof MinerSettings> = {
                    pollInterval,
                    port: 50051, // BOS gRPC API default
                    username: result.username ?? BOS_DEFAULT_USERNAME,
                    password: result.password ?? BOS_DEFAULT_PASSWORD,
                    secure: false,
                };
                minerSettings = {
                    ...minerSettings,
                    ...bosSettings,
                };
                break;
            }

            case 'avalonMiner': {
                const pollInterval = result.pollInterval ?? this.adapter.config.pollInterval;

                const avalonSettings: Omit<AvalonMinerSettings, keyof MinerSettings> = {
                    pollInterval,
                    port: 4028, // TODO: make configurable
                    webPassword: result.webPassword || undefined,
                    // an emptied field means the default, not 0 (which turns the reminder off)
                    filterCleanIntervalDays:
                        typeof result.filterCleanIntervalDays === 'number' &&
                        Number.isFinite(result.filterCleanIntervalDays)
                            ? Math.max(0, result.filterCleanIntervalDays)
                            : undefined,
                };
                minerSettings = {
                    ...minerSettings,
                    ...avalonSettings,
                };
                break;
            }

            default: {
                // TODO: same for category dropdown
                // TODO: hide in dropdown to not create confusion something like "visibleMinerTypes" filter array?
                this.adapter.log.error(
                    `MinerAdapterDeviceManagement/handleNewDevice minerType ${minerSettings.minerType} not yet supported`,
                );
                return undefined;
            }
        }

        const settings: IOBrokerMinerSettings = {
            category: result.category,
            name: result.name,
            mac: result.mac,
            enabled: result.enabled,
            settings: minerSettings,
        };

        return settings;
    }

    /**
     * Build the settings of a pool account from the submitted form.
     *
     * @param context - the action context for showing messages
     * @param result - the submitted form data
     * @returns the settings, or undefined if the form is incomplete
     */
    private async toPoolSettings(
        context: ActionContext,
        result: JsonFormData,
    ): Promise<IOBrokerPoolSettings | undefined> {
        const poolType = result.poolType as PoolType | undefined;
        const apiToken = typeof result.apiToken === 'string' ? result.apiToken.trim() : '';
        const pollInterval = Number(result.poolPollInterval) || BRAIINS_POOL_DEFAULT_POLL_INTERVAL_MS;

        switch (poolType) {
            case 'braiinsPool': {
                if (apiToken === '') {
                    await context.showMessage(I18n.translate('Please enter the API token'));
                    return undefined;
                }
                const settings: BraiinsPoolSettings = {
                    poolType,
                    id: result.id,
                    pollInterval: Math.max(pollInterval, BRAIINS_POOL_MIN_POLL_INTERVAL_MS),
                    apiToken,
                };
                return {
                    category: 'pool',
                    name: result.name,
                    enabled: result.enabled !== false,
                    settings,
                };
            }

            default: {
                this.adapter.log.error(`MinerAdapterDeviceManagement poolType ${poolType} not supported`);
                return undefined;
            }
        }
    }

    /**
     * Device card rows of a pool account: hashrate, workers and balance.
     *
     * @param deviceId - full object id of the device
     * @param features - features of the pool
     * @returns the card rows, keyed by name
     */
    private async getPoolInfoItems(
        deviceId: string,
        features: PoolFeatureKey[],
    ): Promise<Record<string, ConfigItemAny>> {
        const items: Record<string, ConfigItemAny> = {};
        const value = async (id: string): Promise<ioBroker.StateValue | undefined> =>
            (await this.adapter.getForeignStateAsync(`${deviceId}.${id}`))?.val;

        if (features.includes(PoolFeatureKey.hashrate)) {
            // computed here rather than bound to the state: the state is in H/s, unreadable for pool-sized hashrates
            const hashrate = await value('stats.hashrate60m');
            items.hashrate = {
                type: 'staticInfo',
                label: I18n.getTranslatedObject('Hashrate (60 min)'),
                data: typeof hashrate === 'number' ? formatHashrate(hashrate) : I18n.getTranslatedObject('Unknown'),
            };
        }

        if (features.includes(PoolFeatureKey.workerCounts)) {
            const [ok, low, off] = await Promise.all([
                value('stats.workersOk'),
                value('stats.workersLow'),
                value('stats.workersOff'),
            ]);
            if (typeof ok === 'number' && typeof low === 'number' && typeof off === 'number') {
                items.workers = {
                    type: 'staticInfo',
                    label: I18n.getTranslatedObject('Active workers'),
                    data: `${ok + low} / ${ok + low + off}`,
                    styleValue: { color: off > 0 ? 'orange' : 'green' },
                };
            }
        }

        if (features.includes(PoolFeatureKey.rewards)) {
            items.currentBalance = {
                type: 'state',
                oid: `${deviceId}.rewards.currentBalance`,
                foreign: true,
                label: I18n.getTranslatedObject('Current balance'),
                unit: 'BTC',
            };
        }

        return items;
    }

    /**
     * Device card rows for the update check: installed and latest version, and the update status.
     *
     * The status is computed when the card is built rather than bound to `info.updateAvailable` directly:
     * the UI shows a null boolean like `false`, which would display "up to date" when the check failed.
     *
     * @param deviceId - full object id of the device
     * @param installedVersionFeature - the state holding the version the check compares
     * @param supportedFeatures - features of the miner
     * @returns the card rows, keyed by name
     */
    private async getUpdateInfoItems(
        deviceId: string,
        installedVersionFeature: MinerFeatureKey,
        supportedFeatures: MinerFeatureKey[],
    ): Promise<Record<string, ConfigItemAny>> {
        const oid = (key: MinerFeatureKey): string => `${deviceId}.${getMinerFeatureFullId(key)}`;
        const items: Record<string, ConfigItemAny> = {};

        if (supportedFeatures.includes(installedVersionFeature)) {
            items.installedVersion = {
                type: 'state',
                oid: oid(installedVersionFeature),
                foreign: true,
                label: I18n.getTranslatedObject('Installed version'),
            };
        }
        const latestVersion = (await this.adapter.getForeignStateAsync(oid(MinerFeatureKey.latestVersion)))?.val;
        items.latestVersion =
            typeof latestVersion === 'string' && latestVersion.trim() !== ''
                ? {
                      type: 'state',
                      oid: oid(MinerFeatureKey.latestVersion),
                      foreign: true,
                      label: I18n.getTranslatedObject('Latest version'),
                  }
                : {
                      type: 'staticInfo',
                      label: I18n.getTranslatedObject('Latest version'),
                      data: I18n.getTranslatedObject('Unknown'),
                  };

        const status = describeUpdateStatus(
            (await this.adapter.getForeignStateAsync(oid(MinerFeatureKey.updateAvailable)))?.val,
        );
        items.updateStatus = {
            type: 'staticInfo',
            label: I18n.getTranslatedObject('Update'),
            data: I18n.getTranslatedObject(status.text),
            styleValue: { color: status.color },
        };

        if (supportedFeatures.includes(MinerFeatureKey.autoUpgrade)) {
            const autoUpgrade = (await this.adapter.getForeignStateAsync(oid(MinerFeatureKey.autoUpgrade)))?.val;
            // only when known: an older firmware without the setting must not show "OFF"
            if (typeof autoUpgrade === 'boolean') {
                items.autoUpgrade = {
                    type: 'staticInfo',
                    label: I18n.getTranslatedObject('Auto-upgrade'),
                    data: I18n.getTranslatedObject(autoUpgrade ? 'ON' : 'OFF'),
                };
            }
        }

        return items;
    }

    /**
     * Device card rows for the read-only custom features (e.g. a maintenance indicator); the writable ones are device
     * controls (see getControls). Bound to their states, so they update live.
     *
     * @param deviceId - full object id of the device
     * @param miner - a (not initialized) miner of the device's type
     * @returns the card rows, keyed by name
     */
    private getCustomInfoItems(deviceId: string, miner: Miner<MinerSettings>): Record<string, ConfigItemAny> {
        const items: Record<string, ConfigItemAny> = {};
        for (const { id, feature } of resolveCustomFeatures(miner.getCustomChannels())) {
            if (!feature.readable || feature.writable) {
                continue;
            }
            items[`${CUSTOM_CHANNEL}_${id.replace(/\./g, '_')}`] = {
                type: 'state',
                oid: `${deviceId}.${CUSTOM_CHANNEL}.${id}`,
                foreign: true,
                label: feature.label,
                unit: feature.unit,
                // a boolean with a notification is a warning: highlight it while true
                ...(feature.type === 'boolean' && feature.notification
                    ? { trueTextStyle: { color: 'orange' }, falseTextStyle: { color: 'green' } }
                    : {}),
            };
        }
        return items;
    }

    protected async loadDevices(context: DeviceLoadContext<string>): Promise<void> {
        const devices = await this.adapter.getDevicesAsync();

        context.setTotalDevices(devices.length);

        for (const device of devices) {
            // TODO: add more info

            const customInfoItems: Record<string, ConfigItemAny> = {};
            let controls: DeviceControl<string>[] = [];
            let rssiStateId: string | undefined;

            const settings: IOBrokerDeviceSettings = decryptDeviceSettings(
                device.native as IOBrokerDeviceSettings,
                value => this.adapter.decrypt(value),
            );

            let webUrl: string | undefined;
            if (isPool(settings) && settings.settings.poolType) {
                const dummyPool = createPool(settings.settings);
                webUrl = dummyPool.getWebUrl();
                Object.assign(
                    customInfoItems,
                    await this.getPoolInfoItems(device._id, dummyPool.getSupportedFeatures()),
                );
            }

            if (isMiner(settings) && settings.settings.minerType) {
                const dummyMiner = createMiner(settings.settings);

                const supportedFeatures = dummyMiner.getSupportedFeatures();
                controls = await this.getControls(device._id, dummyMiner, supportedFeatures);

                if (supportedFeatures.includes(MinerFeatureKey.running)) {
                    const stateId = `${device._id}.${getMinerFeatureFullId(MinerFeatureKey.running)}`;
                    customInfoItems.running = {
                        type: 'state',
                        oid: stateId,
                        foreign: true,
                        control: 'switch',
                        trueTextStyle: { color: 'green' },
                        falseTextStyle: { color: 'red' },
                        label: I18n.getTranslatedObject('Running'),
                        trueText: I18n.getTranslatedObject('ON'),
                        falseText: I18n.getTranslatedObject('OFF'),
                    };
                }

                if (supportedFeatures.includes(MinerFeatureKey.profile)) {
                    const stateId = `${device._id}.${getMinerFeatureFullId(MinerFeatureKey.profile)}`;
                    customInfoItems.profile = {
                        type: 'state',
                        oid: stateId,
                        foreign: true,
                        control: 'select',
                        label: I18n.getTranslatedObject('Profile'),
                        options: dummyMiner.getProfiles().map(p => ({
                            label: p,
                            value: p,
                        })),
                    };
                }

                if (supportedFeatures.includes(MinerFeatureKey.powerTarget)) {
                    const stateId = `${device._id}.${getMinerFeatureFullId(MinerFeatureKey.powerTarget)}`;
                    // the range the miner reported, see MinerAdapter.applyPowerTargetConstraints
                    const range = (
                        (await this.adapter.getForeignObjectAsync(stateId)) as ioBroker.StateObject | null | undefined
                    )?.common;
                    customInfoItems.powerTarget = {
                        type: 'state',
                        oid: stateId,
                        foreign: true,
                        control: 'number',
                        unit: 'W',
                        min: range?.min ?? 1,
                        max: range?.max,
                        step: 1,
                        // every write reconfigures the miner's tuner: send the finished value only, not each keystroke
                        showEnterButton: I18n.getTranslatedObject('Set'),
                        setOnEnterKey: true,
                        label: I18n.getTranslatedObject('Power Target'),
                    };
                }

                if (supportedFeatures.includes(MinerFeatureKey.rssi)) {
                    const stateId = `${device._id}.${getMinerFeatureFullId(MinerFeatureKey.rssi)}`;
                    // only once reported: a wired miner has no signal strength, and an empty row would read as broken
                    if (typeof (await this.adapter.getForeignStateAsync(stateId))?.val === 'number') {
                        rssiStateId = stateId;
                    }
                }

                Object.assign(customInfoItems, this.getCustomInfoItems(device._id, dummyMiner));

                if (supportedFeatures.includes(MinerFeatureKey.updateAvailable)) {
                    Object.assign(
                        customInfoItems,
                        await this.getUpdateInfoItems(
                            device._id,
                            dummyMiner.getInstalledVersionFeature(),
                            supportedFeatures,
                        ),
                    );
                }
            }

            context.addDevice({
                id: device._id,
                name: device.common.name,
                enabled: {
                    stateId: `${device._id}.enabled`,
                },
                hasDetails: true,
                ...(controls.length > 0 ? { controls } : {}),

                // Connection type using live state binding:
                // Instead of a static value, we bind to a state. The DM UI will read the
                // current value from the state and update in real-time.
                // TODO
                // connectionType: {
                //     stateId: `${device._id}.type`,
                // },

                // Status with live state binding and value mapping:
                // The `online` state is a boolean, but the DM UI expects 'connected'/'disconnected'.
                // The `mapping` object translates boolean values to the expected strings.
                status: {
                    ...(rssiStateId ? { rssi: { stateId: rssiStateId } } : {}),
                    connection: {
                        stateId: `${device._id}.info.online`,
                        mapping: {
                            true: 'connected',
                            false: 'disconnected',
                        },
                    },
                },

                customInfo: {
                    id: device._id,
                    schema: {
                        type: 'panel',
                        items: customInfoItems,
                    },
                },

                actions: [
                    {
                        id: 'delete',
                        description: I18n.getTranslatedObject('Delete this device'),
                        handler: this.handleDeleteDevice.bind(this),
                    },
                    {
                        id: 'settings',
                        description: I18n.getTranslatedObject('Settings'),
                        handler: this.handleSettingsDevice.bind(this),
                    },
                    {
                        id: ACTIONS.ENABLE_DISABLE,
                        description: I18n.getTranslatedObject('enabled'),
                        handler: this.handleEnableDisableDevice.bind(this),
                    },
                    ...(isMiner(settings) && settings.settings.minerType === 'avalonMiner'
                        ? [
                              {
                                  id: 'web',
                                  icon: 'web',
                                  description: I18n.getTranslatedObject('Open web interface'),
                                  url: `http://${settings.settings.host}:${(settings.settings as AvalonMinerSettings).webPort ?? 80}/`,
                              },
                              {
                                  id: 'approveWebLogin',
                                  icon: 'qrcode',
                                  description: I18n.getTranslatedObject('Approve web login'),
                                  handler: this.handleApproveWebLogin.bind(this),
                              },
                          ]
                        : []),
                    ...(webUrl
                        ? [
                              {
                                  id: 'web',
                                  icon: 'web',
                                  description: I18n.getTranslatedObject('Open web interface'),
                                  url: webUrl,
                              },
                          ]
                        : []),
                ],
            });
        }
    }

    /**
     * Controls shown behind the device card's control button: running and profile, if supported, and every writable
     * custom feature, under a header per custom channel. The power target stays on the card only, where it is sent
     * with a "Set" button instead of on every change.
     *
     * @param deviceId - the device object id
     * @param miner - a (not initialized) miner of the device's type
     * @param supportedFeatures - the features the miner supports
     */
    private async getControls(
        deviceId: string,
        miner: Miner<MinerSettings>,
        supportedFeatures: MinerFeatureKey[],
    ): Promise<DeviceControl<string>[]> {
        // the GUI subscribes to stateId, but takes the value from getStateHandler on each change, and the initial
        // value from `state`
        const handler = this.handleControl.bind(this);
        const getStateHandler = this.handleControlState.bind(this);
        const controls: DeviceControl<string>[] = [];

        if (supportedFeatures.includes(MinerFeatureKey.running)) {
            const id = getMinerFeatureFullId(MinerFeatureKey.running);
            controls.push({
                id,
                type: 'switch',
                stateId: `${deviceId}.${id}`,
                label: I18n.getTranslatedObject('Running'),
                handler,
                getStateHandler,
            });
        }
        if (supportedFeatures.includes(MinerFeatureKey.profile)) {
            const id = getMinerFeatureFullId(MinerFeatureKey.profile);
            controls.push({
                id,
                type: 'select',
                stateId: `${deviceId}.${id}`,
                label: I18n.getTranslatedObject('Profile'),
                options: miner.getProfiles().map(p => ({ label: p, value: p })),
                noTranslation: true,
                handler,
                getStateHandler,
            });
        }

        for (const channel of miner.getCustomChannels()) {
            const writable = channel.features.filter(feature => feature.writable);
            if (writable.length === 0) {
                continue;
            }
            controls.push({
                id: `${CUSTOM_CHANNEL}.${channel.id}`,
                type: 'header',
                label: channel.label,
                // the header's background is the theme's primary color: the default text color can be unreadable on it
                color: '#fff',
                style: { padding: '4px 8px', marginTop: 8, borderRadius: 4 },
            });
            for (const feature of writable) {
                const id = `${CUSTOM_CHANNEL}.${channel.id}.${feature.id}`;
                controls.push({
                    ...this.getCustomFeatureControl(feature),
                    id,
                    stateId: `${deviceId}.${id}`,
                    label: feature.label,
                    // a button press carries no value: write true, which is what a press means for a button state
                    handler:
                        feature.role === 'button'
                            ? (dId: string, controlId: string): Promise<ioBroker.State> =>
                                  this.handleControl(dId, controlId, true)
                            : handler,
                    getStateHandler,
                });
            }
        }

        for (const control of controls) {
            if (control.stateId) {
                control.state = (await this.adapter.getForeignStateAsync(control.stateId)) ?? undefined;
            }
        }
        return controls;
    }

    /**
     * The kind of control fitting a custom feature's definition.
     *
     * @param feature - the custom feature
     */
    private getCustomFeatureControl(feature: CustomFeatureDefinition): Omit<DeviceControl<string>, 'id'> {
        if (feature.role === 'button') {
            return { type: 'button', variant: 'outlined' };
        }
        if (feature.states) {
            return {
                type: 'select',
                options: Object.entries(feature.states).map(([value, label]) => ({
                    label,
                    value: feature.type === 'number' ? Number(value) : value,
                })),
                noTranslation: true,
            };
        }
        switch (feature.type) {
            case 'boolean':
                return { type: 'switch' };
            case 'number':
                return feature.min !== undefined && feature.max !== undefined
                    ? {
                          type: 'slider',
                          min: feature.min,
                          max: feature.max,
                          step: feature.step,
                          unit: feature.unit,
                          controlDelay: CONTROL_DELAY_MS,
                      }
                    : { type: 'number', min: feature.min, max: feature.max, step: feature.step, unit: feature.unit };
            case 'string':
                return {
                    type: feature.role === 'level.color.rgb' ? 'color' : 'text',
                    controlDelay: CONTROL_DELAY_MS,
                };
        }
    }

    /**
     * Writes a control's value to its state as a command, so it takes the same path as any other write (see
     * MinerAdapter.onStateChange).
     *
     * @param deviceId - the device object id
     * @param controlId - the control id: the state id relative to the device
     * @param state - the new value
     * @returns the state after the write
     */
    protected async handleControl(deviceId: string, controlId: string, state: ControlState): Promise<ioBroker.State> {
        await this.adapter.setForeignStateAsync(`${deviceId}.${controlId}`, { val: state, ack: false });
        return this.handleControlState(deviceId, controlId);
    }

    /**
     * The current value of a control's state, which the GUI asks for whenever the state changes.
     *
     * @param deviceId - the device object id
     * @param controlId - the control id: the state id relative to the device
     */
    protected async handleControlState(deviceId: string, controlId: string): Promise<ioBroker.State> {
        const now = Date.now();
        return (
            (await this.adapter.getForeignStateAsync(`${deviceId}.${controlId}`)) ?? {
                val: null,
                ack: true,
                ts: now,
                lc: now,
                from: `system.adapter.${this.adapter.namespace}`,
            }
        );
    }

    protected async handleEnableDisableDevice(id: string): Promise<{ refresh: DeviceRefresh }> {
        const stateId = `${id}.enabled`;
        const enabled = (await this.adapter.getStateAsync(stateId))?.val ?? true;

        await this.adapter.setForeignStateAsync(stateId, { val: !enabled, ack: false });

        return { refresh: 'devices' };
    }

    /**
     * Approves the login a browser is waiting for on an Avalon miner's web interface, instead of scanning the QR code
     * with the Avalon Family app.
     *
     * @param id - the device object id
     * @param context - the action context for showing messages
     */
    protected async handleApproveWebLogin(id: string, context: ActionContext): Promise<{ refresh: DeviceRefresh }> {
        const obj = await this.adapter.getObjectAsync(id);
        if (obj == null) {
            this.adapter.log.error(`MinerAdapterDeviceManagement/handleApproveWebLogin object ${id} not found`);
            return { refresh: 'none' };
        }
        const settings = decryptDeviceSettings(obj.native as IOBrokerDeviceSettings, value =>
            this.adapter.decrypt(value),
        );
        const minerId = isMiner(settings) ? settings.settings.id : undefined;
        const miner = minerId ? this.adapter.minerManager.getMiner(minerId) : undefined;

        if (!(miner instanceof AvalonMiner)) {
            await context.showMessage(I18n.getTranslatedObject('The device is disabled.'));
            return { refresh: 'none' };
        }
        if (!miner.settings.webPassword) {
            await context.showMessage(
                I18n.getTranslatedObject(
                    'Enter the web password in the device settings first: the password set for the miner in the Avalon Family app.',
                ),
            );
            return { refresh: 'none' };
        }

        try {
            await miner.approveWebLogin();
            await context.showMessage(
                I18n.getTranslatedObject(
                    "Login approved: the browser showing the miner's login page is logged in within 5 seconds.",
                ),
            );
        } catch (e) {
            const message = e instanceof Error ? e.message : JSON.stringify(e);
            this.adapter.log.warn(`approving the web login of ${id} failed: ${message}`);
            await context.showMessage(
                isWrongPasswordError(message)
                    ? I18n.getTranslatedObject('The miner rejected the web password. Check it in the device settings.')
                    : translateWithArgs('Could not approve the web login: %s', message),
            );
        }
        return { refresh: 'none' };
    }

    protected async handleDeleteDevice(id: string, context: ActionContext): Promise<{ refresh: DeviceRefresh }> {
        const response = await context.showConfirmation(
            I18n.getTranslatedObject('Do you really want to delete the device %s?', id),
        );

        // delete device
        if (!response) {
            return { refresh: 'none' };
        }
        const success = await this.adapter.delDevice(id);
        if (!success) {
            await context.showMessage(I18n.getTranslatedObject('Can not delete device %s', id));
            return { refresh: 'none' };
        }
        return { refresh: 'all' };
    }

    protected async handleSettingsDevice(id: string, context: ActionContext): Promise<{ refresh: DeviceRefresh }> {
        const obj = await this.adapter.getObjectAsync(id);

        if (obj == null) {
            this.adapter.log.error(`MinerAdapterDeviceManagement/handleSettingsDevice object ${id} not found`);
            return { refresh: 'none' };
        }

        const currentSettings: IOBrokerDeviceSettings = decryptDeviceSettings(
            obj.native as IOBrokerDeviceSettings,
            value => this.adapter.decrypt(value),
        );

        if (!isMiner(currentSettings) && !isPool(currentSettings)) {
            this.adapter.log.error(
                `MinerAdapterDeviceManagement/handleSettingsDevice category ${currentSettings.category} not supported`,
            );
            return { refresh: 'none' };
        }

        currentSettings.enabled = ((await this.adapter.getStateAsync(`${id}.enabled`))?.val ?? true) === true;

        const newSettings = await this.showDeviceConfigurationForm(
            context,
            currentSettings,
            I18n.getTranslatedObject('Settings'),
        );

        if (newSettings === undefined) {
            return { refresh: 'none' };
        }

        await this.adapter.updateDevice(newSettings);

        // name change requires full instance refresh, not just device - to display correct name in the devices header in the device list
        if (currentSettings.name != newSettings.name) {
            return { refresh: 'all' };
        }

        return { refresh: 'devices' };
    }

    /**
     * Returns the device details panel for the given device.
     *
     * @param id - the ioBroker object id of the device
     */
    async getDeviceDetails(id: string): Promise<DeviceDetails<string> | null | { error: string }> {
        this.adapter.log.info(`Get device details ${id}`);

        // TODO: cleanup all this boilerplate

        const obj = await this.adapter.getObjectAsync(id);

        if (obj == null) {
            const error = `getDeviceDetails device ${id} not found`;
            this.log.error(error);
            return { error };
        }

        const settings: IOBrokerDeviceSettings = decryptDeviceSettings(obj.native as IOBrokerDeviceSettings, value =>
            this.adapter.decrypt(value),
        );

        if (isPool(settings)) {
            return {
                id,
                schema: {
                    type: 'panel',
                    items: {
                        name: {
                            type: 'text',
                            label: I18n.getTranslatedObject('Name'),
                            newLine: true,
                            sm: 12,
                            disabled: 'true',
                        },
                        poolType: {
                            type: 'text',
                            label: I18n.getTranslatedObject('Pool'),
                            newLine: true,
                            sm: 12,
                            disabled: 'true',
                        },
                    },
                    style: {
                        minWidth: 420,
                    },
                },
                data: {
                    name: obj.common.name,
                    poolType: getPoolTypeLabel(settings.settings.poolType),
                },
            };
        }

        if (!isMiner(settings)) {
            const error = `getDeviceDetails category ${obj.native.category} not yet supported`;
            this.log.error(error);
            return { error };
        }

        // create dummy miner to get CLI args
        const dummyMiner = createMiner(settings.settings);

        // TODO: more details
        return {
            id,
            schema: {
                type: 'panel',
                items: {
                    name: {
                        type: 'text',
                        label: I18n.getTranslatedObject('Name'),
                        newLine: true,
                        sm: 12,
                        disabled: 'true',
                    },
                    minerCliParams: {
                        type: 'text',
                        label: I18n.translate('Miner CLI parameters'),
                        sm: 12,
                        disabled: 'true',
                        hidden: !dummyMiner.getSupportedFeatures().includes(MinerFeatureKey.cliArgs),
                    },
                },
                style: {
                    minWidth: 420,
                },
            },
            data: {
                name: obj.common.name,
                minerCliParams: dummyMiner.getCliArgs().join(' '),
            },
        };
    }

    /**
     *
     */
    async close(): Promise<void> {
        // do nothing
    }
}

export default MinerAdapterDeviceManagement;

function getPasswordFormValue(settings: PartialDeep<IOBrokerMinerSettings>): string {
    switch (settings.settings?.minerType) {
        case 'teamRedMiner': {
            return (settings.settings as PartialDeep<TeamRedMinerSettings>).claymore?.password ?? '';
        }

        case 'claymoreMiner':
        case 'xmRig':
        case 'iceRiverOcMiner':
        case 'bos': {
            return (
                (
                    settings.settings as PartialDeep<
                        ClaymoreMinerSettings | XMRigSettings | IceRiverOcMinerSettings | BOSSettings
                    >
                ).password ?? (settings.settings.minerType === 'bos' ? BOS_DEFAULT_PASSWORD : '')
            );
        }

        case 'bosMiner': {
            return (settings.settings as PartialDeep<BOSMinerSettings>).password ?? BOS_DEFAULT_PASSWORD;
        }

        default: {
            return '';
        }
    }
}

function getPoolTypeLabel(poolType: PoolType): string {
    switch (poolType) {
        case 'braiinsPool': {
            return 'Braiins Pool';
        }

        default: {
            return poolType;
        }
    }
}
