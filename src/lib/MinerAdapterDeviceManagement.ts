import {
    DeviceManagement,
    type ConfigItemAny,
    type ActionContext,
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
    BOSMinerSettings,
    ClaymoreMinerSettings,
    IceRiverOcMinerSettings,
    MinerSettings,
    PollingMinerSettings,
    SGMinerSettings,
    TeamRedMinerSettings,
    XMRigSettings,
} from './miner/model/MinerSettings';
import { minerTypeKeys } from './miner/model/MinerSettings';
import type { IOBrokerDeviceSettings, IOBrokerMinerSettings } from '../miner/model/IOBrokerMinerSettings';
import { decryptDeviceSettings, isMiner } from '../miner/model/IOBrokerMinerSettings';
import type { PartialDeep } from 'type-fest';
import { createMiner } from './miner/miner/MinerFactory';
import { getMinerFeatureFullId, MinerFeatureKey } from './miner/model/MinerFeature';

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
                    id: 'refresh',
                    title: '',
                    description: I18n.getTranslatedObject('Refresh device list'),
                    handler: this.handleRefresh.bind(this),
                },
                {
                    id: 'newDevice',
                    title: '',
                    description: I18n.getTranslatedObject('Add new device to Miner'),
                    handler: this.handleNewDevice.bind(this),
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
     * Refreshes the device list.
     *
     * @param _context - the action context
     */
    handleRefresh(_context: ActionContext): { refresh: boolean } {
        this.adapter.log.info('handleRefresh');
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
                    sg: {
                        minerType: 'sgMiner',
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
        );

        this.adapter.log.debug(`handleNewDevice settings: ${JSON.stringify(settings)}`);

        if (settings === undefined) {
            return { refresh: false };
        }

        await this.adapter.addDevice(settings);

        return { refresh: true };
    }

    private async showDeviceConfigurationForm(
        context: ActionContext,
        existingSettings: PartialDeep<IOBrokerDeviceSettings>,
        title: ioBroker.StringOrTranslated,
    ): Promise<IOBrokerMinerSettings | undefined> {
        // TODO: re-open form with filled in values if something is missing after showing validation result
        // basically recursive call with existingSettings = return value of this function

        this.adapter.log.debug(`showDeviceConfigurationForm existingSettings: ${JSON.stringify(existingSettings)}`);

        // TODO: implement pool support
        if (!isMiner(existingSettings)) {
            this.adapter.log.error(
                `MinerAdapterDeviceManagement/showDeviceConfigurationForm existingSettings ${JSON.stringify(existingSettings)} is not a miner.`,
            );
            return undefined;
        }

        const result: JsonFormData | undefined = await context.showForm(
            {
                type: 'panel',
                items: {
                    category: {
                        type: 'select',
                        format: 'dropdown',
                        newLine: true,
                        label: I18n.getTranslatedObject('Category'),
                        tooltip: 'category of the iobroker thing (miner or pool)',
                        options: categoryKeys.map(key => {
                            return {
                                value: key,
                                // TODO: translate(key)
                                label: key,
                            };
                        }),
                    },
                    poolWip: {
                        type: 'staticText',
                        newLine: true,
                        text: I18n.getTranslatedObject('Pool support is not yet available'),
                        hidden: "data.category === 'miner'",
                        style: { color: '#ff9800', fontWeight: 'bold' },
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
                        hidden: "data.category !== 'miner'",
                    },
                    name: {
                        type: 'text',
                        newLine: true,
                        // trim: false,
                        label: I18n.getTranslatedObject('Name'),
                        tooltip: 'name for the user to identify the device',
                        hidden: "data.category !== 'miner'",
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
                    password: {
                        type: 'text',
                        // type password does not allow to show the password generated as default value
                        // type: 'password',
                        newLine: true,
                        label: I18n.getTranslatedObject('password'),
                        tooltip:
                            'password used to connect to the device api. Adapter generates a random, secure and unique one for each device by default. But can of course be changed if needed.',
                        hidden: "data.category !== 'miner' || !(data.minerType == 'claymoreMiner' || data.minerType == 'xmRig' || data.minerType == 'iceRiverOcMiner' || data.minerType == 'teamRedMiner')", // TODO: improve this
                    },
                    enabled: {
                        type: 'checkbox',
                        newLine: true,
                        label: I18n.getTranslatedObject('enabled'),
                        tooltip:
                            'whether the device is enabled or not. Disabled devices will do nothing (not get polled, control does not work, ...). Useful if you f.e. shut one off temporarily.',
                        hidden: "data.category !== 'miner'",
                    },
                },
            },
            {
                data: {
                    category: existingSettings.category,
                    id: existingSettings.settings.id,
                    minerType: existingSettings.settings.minerType,
                    name: existingSettings.name,
                    host: existingSettings.settings.host,
                    mac: existingSettings.mac,
                    pollInterval: (existingSettings.settings as PollingMinerSettings).pollInterval ?? 10000, // TODO: implement this properly
                    password: (existingSettings.settings as TeamRedMinerSettings).claymore?.password ?? '', // TODO: implement this properly
                    enabled: existingSettings.enabled,
                },
                title,
            },
        );

        console.log('add device result: ', result);

        if (result === null || result === undefined) {
            return undefined;
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
                    sg: {
                        minerType: 'sgMiner',
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

            case 'sgMiner': {
                const pollInterval = result.pollInterval ?? this.adapter.config.pollInterval;

                const sgSettings: Omit<SGMinerSettings, keyof MinerSettings> = {
                    pollInterval,
                    port: 4028, // TODO: make configurable
                };
                minerSettings = {
                    ...minerSettings,
                    ...sgSettings,
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

    protected async loadDevices(context: DeviceLoadContext<string>): Promise<void> {
        const devices = await this.adapter.getDevicesAsync();

        context.setTotalDevices(devices.length);

        for (const device of devices) {
            // TODO: add more info

            const customInfoItems: Record<string, ConfigItemAny> = {};

            const settings: IOBrokerDeviceSettings = decryptDeviceSettings(
                device.native as IOBrokerDeviceSettings,
                value => this.adapter.decrypt(value),
            );

            if (isMiner(settings) && settings.settings.minerType) {
                const dummyMiner = createMiner(settings.settings);

                const supportedFeatures = dummyMiner.getSupportedFeatures();

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
            }

            context.addDevice({
                id: device._id,
                name: device.common.name,
                hasDetails: true,

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
                ],
            });
        }
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

        const newSettings = await this.showDeviceConfigurationForm(
            context,
            currentSettings,
            I18n.getTranslatedObject('Settings'),
        );

        this.adapter.log.debug(`handleSettingsDevice newSettings: ${JSON.stringify(newSettings)}`);

        if (newSettings === undefined) {
            return { refresh: 'none' };
        }

        await this.adapter.updateDevice(newSettings);

        if (!isMiner(currentSettings) || !isMiner(newSettings)) {
            // TODO: pool support (#deal with miner -> pool change: just disable category dropdown on settings)
            this.adapter.log.error(`MinerAdapterDeviceManagement/handleSettingsDevice settings are not miners`);
            return { refresh: 'none' };
        }

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

        if (!isMiner(settings)) {
            // TODO: pool support
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
