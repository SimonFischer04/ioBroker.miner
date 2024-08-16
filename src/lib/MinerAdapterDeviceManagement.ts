import {
    ActionContext,
    DeviceInfo,
    DeviceManagement,
    DeviceRefresh,
    InstanceDetails,
    JsonFormData
} from '@iobroker/dm-utils';
import {MinerAdapter} from '../main';
import {categoryKeys} from './miner/model/Category';
import {MinerSettings, minerTypeKeys, PollingMinerSettings, TeamRedMinerSettings} from './miner/model/MinerSettings';
import {
    decryptDeviceSettings,
    IOBrokerDeviceSettings,
    IOBrokerMinerSettings,
    isMiner
} from '../miner/model/IOBrokerMinerSettings';
import {PartialDeep} from 'type-fest';

class MinerAdapterDeviceManagement extends DeviceManagement<MinerAdapter> {
    async getInstanceInfo(): Promise<InstanceDetails> {
        const data = {
            ...super.getInstanceInfo(),
            actions: [
                {
                    id: 'newDevice',
                    icon: 'fas fa-plus',
                    title: '',
                    description: {
                        en: 'Add new device to Miner',
                        de: 'Neues Gerät zu Miner hinzufügen',
                        ru: 'Добавить новое устройство в Miner',
                        pt: 'Adicionar novo dispositivo ao Miner',
                        nl: 'Voeg nieuw apparaat toe aan Miner',
                        fr: 'Ajouter un nouvel appareil à Miner',
                        it: 'Aggiungi nuovo dispositivo a Miner',
                        es: 'Agregar nuevo dispositivo a Miner',
                        pl: 'Dodaj nowe urządzenie do Miner',
                        'zh-cn': '将新设备添加到Miner',
                        uk: 'Додати новий пристрій до Miner'
                    },
                    handler: this.handleNewDevice.bind(this)
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

    async handleNewDevice(context: ActionContext): Promise<{ refresh: boolean }> {
        this.adapter.log.info('handleNewDevice');

        const settings = await this.showDeviceConfigurationForm(context, {
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
                    port: 3333
                },
                sg: {
                    minerType: 'sgMiner',
                    host: '',
                    port: 4028
                }
            },
            name: '',
            mac: '',
            enabled: true
        } as PartialDeep<IOBrokerMinerSettings>, { // TODO: improve this (by making IOBrokerMinerSettings generic?, ...)
            en: 'Add new device',
            de: 'Neues Gerät hinzufügen',
            ru: 'Добавить новое устройство',
            pt: 'Adicionar novo dispositivo',
            nl: 'Voeg nieuw apparaat toe',
            fr: 'Ajouter un nouvel appareil',
            it: 'Aggiungi nuovo dispositivo',
            es: 'Agregar nuevo dispositivo',
            pl: 'Dodaj nowe urządzenie',
            'zh-cn': '添加新设备',
            uk: 'Додати новий пристрій'
        });

        this.adapter.log.debug(`handleNewDevice settings: ${JSON.stringify(settings)}`);

        if (settings === undefined) {
            return {refresh: false};
        }

        await this.adapter.addDevice(settings);

        return {refresh: true};
    }

    private async showDeviceConfigurationForm(context: ActionContext, existingSettings: PartialDeep<IOBrokerDeviceSettings>, title: ioBroker.StringOrTranslated): Promise<IOBrokerMinerSettings | undefined> {
        // TODO: re-open form with filled in values if something is missing after showing validation result
        // basically recursive call with existingSettings = return value of this function

        this.adapter.log.debug(`showDeviceConfigurationForm existingSettings: ${JSON.stringify(existingSettings)}`);

        // TODO: implement pool support
        if (!isMiner(existingSettings)) {
            this.adapter.log.error(`MinerAdapterDeviceManagement/showDeviceConfigurationForm existingSettings ${existingSettings} is not a miner.`);
            return undefined;
        }

        const result: JsonFormData | undefined = await context.showForm({
            type: 'panel',
            items: {
                category: {
                    type: 'select',
                    newLine: true,
                    label: 'category', // TODO: translate
                    // TODO: FixMeLater
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    options: categoryKeys.map(key => {
                        return {
                            value: key,
                            // TODO: translate(key)
                            label: key
                        }
                    })
                },
                minerType: {
                    type: 'select',
                    newLine: true,
                    label: 'minerType', // TODO: translate
                    // TODO: FixMeLater
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    options: minerTypeKeys.map(key => {
                        return {
                            value: key,
                            // TODO: translate(key)
                            label: key
                        }
                    })
                },
                id: {
                    type: 'text',
                    newLine: true,
                    label: 'id', // TODO: translate
                    // TODO: FixMeLater
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    readOnly: true,
                    // TODO: FixMeLater
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    noClearButton: true
                },
                name: {
                    type: 'text',
                    newLine: true,
                    // TODO: FixMeLater
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    // trim: false,
                    label: {
                        en: 'Name',
                        de: 'Name',
                        ru: 'Имя',
                        pt: 'Nome',
                        nl: 'Naam',
                        fr: 'Nom',
                        it: 'Nome',
                        es: 'Nombre',
                        pl: 'Nazwa',
                        'zh-cn': '名称',
                        uk: 'Ім\'я'
                    }
                },
                host: {
                    type: 'text',
                    newLine: true,
                    // TODO: FixMeLater
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    trim: true,
                    placeholder: 'fe80::42',
                    label: {
                        en: 'IP address',
                        de: 'IP-Adresse',
                        ru: 'IP адрес',
                        pt: 'Endereço de IP',
                        nl: 'IP adres',
                        fr: 'Adresse IP',
                        it: 'Indirizzo IP',
                        es: 'Dirección IP',
                        pl: 'Adres IP',
                        'zh-cn': 'IP地址',
                        uk: 'IP адреса'
                    }
                },
                // TODO: get by request
                mac: {
                    type: 'text',
                    newLine: true,
                    // TODO: FixMeLater
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    trim: true,
                    placeholder: '00:00:00:00:00:00',
                    label: {
                        en: 'MAC address',
                        de: 'MAC-Adresse',
                        ru: 'MAC адрес',
                        pt: 'Endereço MAC',
                        nl: 'MAC adres',
                        fr: 'Adresse MAC',
                        it: 'Indirizzo MAC',
                        es: 'Dirección MAC',
                        pl: 'Adres MAC',
                        'zh-cn': 'MAC地址',
                        uk: 'MAC адреса'
                    },
                },
                // TODO: show only if miner requires polling? possible to dynamically add fields to form?
                pollInterval: {
                    type: 'number',
                    newLine: true,
                    // TODO: FixMeLater
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    min: 100,
                    unit: 'ms',
                    label: {
                        'en': 'poll interval', // TODO: also fix translate in jsonConfig.json
                        'de': 'Abrufintervall',
                        'ru': 'интервал',
                        'pt': 'intervalo de poluição',
                        'nl': 'poll-interval',
                        'fr': 'intervalle de sondage',
                        'it': 'intervallo di sondaggio',
                        'es': 'intervalo de encuesta',
                        'pl': 'przedział ankietowy',
                        'uk': 'інтервал опитування',
                        'zh-cn': '民意调查间隔'
                    }
                },
                password: {
                    type: 'text',
                    // type password does not allow to show the password generated as default value
                    // type: 'password',
                    newLine: true,
                    // TODO: FixMeLater
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    // visible: true,
                    label: {
                        'en': 'password',
                        'de': 'passwort',
                        'ru': 'пароль',
                        'pt': 'senha',
                        'nl': 'wachtwoord',
                        'fr': 'mot de passe',
                        'it': 'password',
                        'es': 'contraseña',
                        'pl': 'hasło',
                        'uk': 'увійти',
                        'zh-cn': '密码'
                    }
                },
                enabled: {
                    type: 'checkbox',
                    newLine: true,
                    label: {
                        'en': 'enabled',
                        'de': 'aktiviert',
                        'ru': 'включен',
                        'pt': 'habilitado',
                        'nl': 'ingeschakeld',
                        'fr': 'activé',
                        'it': 'abilitata',
                        'es': 'habilitado',
                        'pl': 'włączone',
                        'uk': 'увімкнути',
                        'zh-cn': '启用'
                    }
                }
            }
        },
        {
            data: {
                category: existingSettings.category,
                id: existingSettings.settings.id,
                minerType: existingSettings.settings.minerType,
                name: existingSettings.name,
                host: existingSettings.settings.host,
                mac: existingSettings.mac,
                pollInterval: (existingSettings.settings as PollingMinerSettings).pollInterval, // TODO: implement this properly
                password: (existingSettings.settings as TeamRedMinerSettings).claymore?.password ?? '', // TODO: implement this properly
                enabled: existingSettings.enabled
            },
            title
        }
        );

        console.log('add device result: ', result);

        if (result === null || result === undefined) {
            return undefined;
        }

        // TODO: check category && minerType

        // Check if mac was entered
        // TODO: get from device
        if (result.mac === '') {
            await context.showMessage(`MAC address required`);
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
            await context.showMessage(`Please enter an IP address`);
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

        if (!isMiner({category: result.category})) { // TODO: pool support
            this.log.error(`MinerAdapterDeviceManagement/handleNewDevice category ${result.category} is not yet supported.`);
            return undefined;
        }

        let minerSettings: MinerSettings = {
            id: result.id,
            minerType: result.minerType,
            host: result.host
        }

        switch (minerSettings.minerType) {
            case 'teamRedMiner': {
                const pollInterval = result.pollInterval ?? this.adapter.config.pollInterval;

                const trmSettings: Omit<TeamRedMinerSettings, keyof MinerSettings> = {
                    pollInterval,
                    claymore: {
                        minerType: 'claymoreMiner',
                        pollInterval,
                        host: minerSettings.host,
                        password: result.password,
                        port: 3333 // TODO: make configurable
                    },
                    sg: {
                        minerType: 'sgMiner',
                        pollInterval,
                        host: minerSettings.host,
                        port: 4028 // TODO: make configurable
                    }
                }
                minerSettings = {
                    ...minerSettings,
                    ...trmSettings
                }
                break;
            }

            default: {
                // TODO: same for category dropdown
                // TODO: hide in dropdown to not create confusion something like "visibleMinerTypes" filter array?
                this.adapter.log.error(`MinerAdapterDeviceManagement/handleNewDevice minerType ${minerSettings.minerType} not yet supported`);
                return undefined;
            }
        }

        const settings: IOBrokerMinerSettings = {
            category: result.category,
            name: result.name,
            mac: result.mac,
            enabled: result.enabled,
            settings: minerSettings
        }

        return settings;
    }

    protected async listDevices(): Promise<DeviceInfo[]> {
        const devices = await this.adapter.getDevicesAsync();
        const arrDevices: DeviceInfo[] = [];
        console.error('alistDevices')

        debugger

        for (const device of devices) {
            // TODO: add more info

            arrDevices.push({
                id: device._id,
                name: device.common.name,
                hasDetails: true,
                actions: [
                    {
                        id: 'delete',
                        icon: 'fa-solid fa-trash-can',
                        description: {
                            en: 'Delete this device',
                            de: 'Gerät löschen',
                            ru: 'Удалить это устройство',
                            pt: 'Excluir este dispositivo',
                            nl: 'Verwijder dit apparaat',
                            fr: 'Supprimer cet appareil',
                            it: 'Elimina questo dispositivo',
                            es: 'Eliminar este dispositivo',
                            pl: 'Usuń to urządzenie',
                            'zh-cn': '删除此设备',
                            uk: 'Видалити цей пристрій'
                        },
                        handler: this.handleDeleteDevice.bind(this)
                    },
                    {
                        id: 'settings',
                        icon: 'fa-solid fa-gear',
                        description: {
                            en: 'Settings',
                            de: 'Einstellungen',
                            ru: 'Настройки',
                            pt: 'Configurações',
                            nl: 'Instellingen',
                            fr: 'Paramètres',
                            it: 'Impostazioni',
                            es: 'Configuraciones',
                            pl: 'Ustawienia',
                            'zh-cn': '设定值',
                            uk: 'Налаштування'
                        },
                        handler: this.handleSettingsDevice.bind(this)
                    }
                ]
            })
        }

        return arrDevices;
    }

    protected async handleDeleteDevice(id: string, context: ActionContext): Promise<{ refresh: DeviceRefresh }> {
        const response = await context.showConfirmation({
            en: `Do you really want to delete the device ${id}?`,
            de: `Möchten Sie das Gerät ${id} wirklich löschen?`,
            ru: `Вы действительно хотите удалить устройство ${id}?`,
            pt: `Você realmente deseja excluir o dispositivo ${id}?`,
            nl: `Weet u zeker dat u het apparaat ${id} wilt verwijderen?`,
            fr: `Voulez-vous vraiment supprimer l'appareil ${id} ?`,
            it: `Vuoi davvero eliminare il dispositivo ${id}?`,
            es: `¿Realmente desea eliminar el dispositivo ${id}?`,
            pl: `Czy na pewno chcesz usunąć urządzenie ${id}?`,
            'zh-cn': `您真的要删除设备 ${id} 吗？`,
            uk: `Ви дійсно бажаєте видалити пристрій ${id}?`
        });

        // delete device
        if (!response) {
            return {refresh: false};
        }
        const success = await this.adapter.delDevice(id);
        if (!success) {
            await context.showMessage({
                en: `Can not delete device ${id}`,
                de: `Gerät ${id} kann nicht gelöscht werden`,
                ru: `Невозможно удалить устройство ${id}`,
                pt: `Não é possível excluir o dispositivo ${id}`,
                nl: `Kan apparaat ${id} niet verwijderen`,
                fr: `Impossible de supprimer l'appareil ${id}`,
                it: `Impossibile eliminare il dispositivo ${id}`,
                es: `No se puede eliminar el dispositivo ${id}`,
                pl: `Nie można usunąć urządzenia ${id}`,
                'zh-cn': `无法删除设备 ${id}`,
                uk: `Не вдалося видалити пристрій ${id}`
            });
            return {refresh: false};
        } else {
            return {refresh: true};
        }
    }

    protected async handleSettingsDevice(id: string, context: ActionContext): Promise<{ refresh: DeviceRefresh }> {
        const obj = await this.adapter.getObjectAsync(id);

        if (obj == null) {
            this.adapter.log.error(`MinerAdapterDeviceManagement/handleSettingsDevice object ${id} not found`);
            return {refresh: false};
        }

        const currentSettings: IOBrokerDeviceSettings = decryptDeviceSettings(obj.native as IOBrokerDeviceSettings, (value) => this.adapter.decrypt(value));

        const newSettings = await this.showDeviceConfigurationForm(context, currentSettings, {
            en: 'Settings',
            de: 'Einstellungen',
            ru: 'Настройки',
            pt: 'Configurações',
            nl: 'Instellingen',
            fr: 'Paramètres',
            it: 'Impostazioni',
            es: 'Configuraciones',
            pl: 'Ustawienia',
            'zh-cn': '设定值',
            uk: 'Налаштування'
        });

        this.adapter.log.debug(`handleSettingsDevice newSettings: ${JSON.stringify(newSettings)}`);

        if (newSettings === undefined) {
            return {refresh: false};
        }

        await this.adapter.updateDevice(newSettings);

        if (!isMiner(currentSettings) || !isMiner(newSettings)) { // TODO: pool support (#deal with miner -> pool change: just disable category dropdown on settings)
            this.adapter.log.error(`MinerAdapterDeviceManagement/handleSettingsDevice settings are not miners`);
            return {refresh: false};
        }

        // name change requires full instance refresh, not just device - to display correct name in the devices header in the device list
        if (currentSettings.name != newSettings.name) {
            // PS: I don't know why this doesn't work
            // return {refresh: 'instance'};
            return {refresh: true};
        }

        return {refresh: 'device'};
    }

    async close(): Promise<void> {
        // do nothing
    }
}

export default MinerAdapterDeviceManagement;