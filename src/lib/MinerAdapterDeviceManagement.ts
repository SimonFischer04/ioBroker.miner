import {ActionContext, DeviceInfo, DeviceManagement, JsonFormData} from '@iobroker/dm-utils';
import {MinerAdapter} from '../main';
import {categoryKeys} from './miner/model/Category';
import {MinerSettings, minerTypeKeys, TeamRedMinerSettings} from './miner/model/MinerSettings';
import {IOBrokerMinerSettings, isMiner} from '../miner/model/IOBrokerMinerSettings';

class MinerAdapterDeviceManagement extends DeviceManagement<MinerAdapter> {
    async getInstanceInfo() {
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

    async handleNewDevice(context: ActionContext) {
        this.adapter.log.info('handleNewDevice');

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
                    min: 10_000,
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
                category: 'miner',
                minerType: undefined,
                name: '',
                host: '',
                mac: '',
                pollInterval: this.adapter.config.pollInterval,
                enabled: true
            },
            title: {
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
            }
        }
        );

        console.log('add device result: ', result);

        if (result === null || result === undefined) {
            return {refresh: false};
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
            if (!result.mac.match(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)) {
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
                return {refresh: false};
            }
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
            return {refresh: false};
        }
        // Check if ip is valid
        if (result.host !== '') {
            // Check ip has the right format
            // TODO: fix this check
            if (!result.host.match(/^(\d{1,3}\.){3}\d{1,3}$/) && false) {
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
                return {refresh: false};
            }
        }

        if (!isMiner({category: result.category})) { // TODO: pool support
            this.log.error(`MinerAdapterDeviceManagement/handleNewDevice category ${result.category} is not yet supported.`);
            return {refresh: false};
        }

        let minerSettings: MinerSettings = {
            minerType: result.minerType
        }

        switch (minerSettings.minerType) {
            case 'teamRedMiner': {
                const pollInterval = result.pollInterval ?? this.adapter.config.pollInterval;

                const trmSettings: Omit<TeamRedMinerSettings, 'minerType'> = {
                    claymore: {
                        minerType: 'claymoreMiner',
                        pollInterval,
                        host: result.host,
                        password: 'TODO', // TODO
                        port: 3333 // TODO: make configurable
                    },
                    sg: {
                        minerType: 'sgMiner',
                        pollInterval,
                        host: result.host,
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
                this.adapter.log.error(`MinerAdapterDeviceManagement/handleNewDevice minerType ${minerSettings.minerType} not yet supported`);
                return {refresh: false};
            }
        }

        const settings: IOBrokerMinerSettings = {
            category: result.category,
            name: result.name,
            host: result.host,
            mac: result.mac,
            enabled: result.enabled,
            settings: minerSettings
        }
        await this.adapter.addDevice(settings);

        return {refresh: true};
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
                name: device.common.name
            })
        }

        return arrDevices;
    }

    async debugging(): Promise<void> {
        const devices = await this.adapter.getDevicesAsync();
        const arrDevices: DeviceInfo[] = [];
        console.error('listDevices')

        debugger

        // for (const i in devices) {
        for (const i of devices) {
            console.error('bTF2', i);
        }
    }

    async close(): Promise<void> {
        // do nothing
    }
}

export default MinerAdapterDeviceManagement;