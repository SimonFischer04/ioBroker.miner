import * as utils from '@iobroker/adapter-core';
import MinerAdapterDeviceManagement from './lib/MinerAdapterDeviceManagement';
import {categoryKeys} from './lib/miner/model/Category';
import {MinerManager} from './lib/miner/miner/MinerManager';
import {IOBrokerDeviceSettings, isMiner} from './miner/model/IOBrokerMinerSettings';
import {Level} from './lib/miner/model/Level';
import {
    getMinerFeatureFullId,
    MinerFeatureCategory,
    MinerFeatureKey,
    minerFeatures
} from './lib/miner/model/MinerFeature';
import {createMiner} from './lib/miner/miner/MinerFactory';
import {Logger} from './lib/miner/model/Logger';
import {Miner} from './lib/miner/miner/Miner';
import {MinerSettings} from './lib/miner/model/MinerSettings';
import {MinerStats} from './lib/miner/model/MinerStats';

export class MinerAdapter extends utils.Adapter {
    private readonly deviceManagement: MinerAdapterDeviceManagement;
    private readonly minerManager: MinerManager = new MinerManager();

    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'miner',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        // this.on('objectChange', this.onObjectChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));

        this.deviceManagement = new MinerAdapterDeviceManagement(this);
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        this.setupMinerLib();

        // Reset the connection indicator during startup
        await this.setState('info.connection', false, true);

        // Initialize your adapter here
        await this.createBasicObjectStructure();

        // The adapters config (in the instance object everything under the attribute "native") is accessible via
        // this.config:
        this.log.info('aconfig option1: ' + this.config.option1);
        this.log.info('config option2: ' + this.config.option2);
        console.log('testABC')

        /*
        For every state in the system there has to be also an object of type state
        Here a simple template for a boolean variable named "testVariable"
        Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
        */
        await this.setObjectNotExistsAsync('testVariable', {
            type: 'state',
            common: {
                name: 'testVariable',
                type: 'boolean',
                role: 'indicator',
                read: true,
                write: true,
            },
            native: {},
        });

        // In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
        this.subscribeStates('testVariable');
        // You can also add a subscription for multiple states. The following line watches all states starting with "lights."
        // this.subscribeStates('lights.*');
        // Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
        // this.subscribeStates('*');

        /*
            setState examples
            you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
        */
        // the variable testVariable is set to true as command (ack=false)
        await this.setStateAsync('testVariable', true);

        // same thing, but the value is flagged "ack"
        // ack should be always set to true if the value is received from or acknowledged from the target system
        await this.setStateAsync('testVariable', {val: true, ack: true});

        // same thing, but the state is deleted after 30s (getState will return null afterwards)
        await this.setStateAsync('testVariable', {val: true, ack: true, expire: 30});

        // try to connect to already known devices
        await this.tryKnownDevices();

        this.subscribeStates('miner.*.control.*');
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private async onUnload(callback: () => void): Promise<void> {
        try {
            await this.minerManager.close();

            if (this.deviceManagement) {
                await this.deviceManagement.close();
            }

            callback();
        } catch (e) {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }

    /**
     * Is called if a subscribed state changes
     */
    private async onStateChange(id: string, state: ioBroker.State | null | undefined): Promise<void> {
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);

            // if (this.deviceManagement) {
            //     this.deviceManagement.debugging();
            // }

            // adapters usually should not process ack=true messages
            if (state.ack)
                return

            // example: miner.0.miner.d85ed30e24d3.control.running
            const parts = id.split('.');
            if (parts.length < 5) {
                this.log.error(`invalid state id: ${id}`);
                return;
            }

            const deviceObjectId: string = parts.slice(0, 4).join('.');
            const obj = await this.getObjectAsync(deviceObjectId);
            if (obj === null || obj === undefined) {
                this.log.warn(`Object ${deviceObjectId} not found`);
                return;
            }
            const deviceSettings = obj.native as IOBrokerDeviceSettings;
            if (!isMiner(deviceSettings)) {
                this.log.warn(`category ${deviceSettings.category} not yet supported`);
                return;
            }

            // example: control.running
            const minerObjectId: string = parts.slice(4).join('.');

            switch (minerObjectId) {
                case getMinerFeatureFullId(MinerFeatureKey.running): {
                    this.log.debug(`running state changed to ${state.val}`);

                    if (deviceSettings.settings.id === undefined) {
                        this.log.error(`device ${deviceSettings.name} has no id`);
                        return;
                    }

                    if (state.val) {
                        await this.minerManager.startMiner(deviceSettings.settings.id);
                    } else {
                        await this.minerManager.stopMiner(deviceSettings.settings.id);
                    }
                    await this.setState(id, {val: state.val, ack: true});
                    break;
                }

                default: {
                    this.log.warn(`unknown handling of state ${id}`);
                }
            }
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
    //  */
    // private onMessage(obj: ioBroker.Message): void {
    //     if (typeof obj === 'object' && obj.message) {
    //         if (obj.command === 'send') {
    //             // e.g. send email or pushover or whatever
    //             this.log.info('send command');

    //             // Send response in callback if required
    //             if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
    //         }
    //     }
    // }

    private async createBasicObjectStructure(): Promise<void> {
        for (const key of categoryKeys) {
            await this.setObjectNotExistsAsync(key, {
                type: 'folder',
                common: {
                    // TODO: translate(key+"Folder") oda so
                    name: key
                },
                native: {}
            });
        }
    }

    // Try to initialise and connect to already known devices
    private async tryKnownDevices(): Promise<void> {
        const knownDevices = await this.getDevicesAsync();

        for (const device of knownDevices) {
            await this.initDevice(device);
        }
    }

    public async addDevice(settings: IOBrokerDeviceSettings): Promise<void> {
        if (!isMiner(settings)) { // TODO: pool support
            this.log.error(`category ${settings.category} is not yet supported.`);
            return;
        }

        // TODO: fill settings.mac using arp request
        const id = this.getDeviceObjectId(settings);

        await this.extendObject(id, {
            type: 'device',
            common: {
                name: settings.name || settings.host
            },
            native: settings
        });

        const obj: ioBroker.DeviceObject = await this.getObjectAsync(id) as ioBroker.DeviceObject;
        this.log.debug(`created new device obj: ${JSON.stringify(obj)}`);

        await this.initDevice(obj);
    }

    private async initDevice(device: ioBroker.DeviceObject): Promise<void> {
        const settings: IOBrokerDeviceSettings = device.native as IOBrokerDeviceSettings;

        if (!isMiner(settings)) {
            this.log.error(`tryKnownDevices category ${settings.category} not yet supported`);
            return;
        }

        await this.createDeviceStateObjects(settings);

        if (!settings.enabled) {
            this.log.info(`device ${settings.name} is disabled`);
            return;
        }

        const miner = await this.minerManager.init(settings.settings);

        miner.subscribeToStats(async (stats: MinerStats) => {
            this.log.debug(`received stats: ${JSON.stringify(stats)}`);
            await this.processNewStats(miner, settings, stats);
        });
    }

    private async processNewStats(miner: Miner<MinerSettings>,settings: IOBrokerDeviceSettings, stats: MinerStats): Promise<void> {
        for (const feature of miner.getSupportedFeatures()) {
            // TODO: cleanup, just filter for info features and then directly infer object id from there somehow
            // change MinerStates to Record<MinerFeatureKey, val>?
            switch (feature) {
                case MinerFeatureKey.version: {
                    await this.setState(this.getStateFullObjectId(settings, MinerFeatureKey.version), {val: stats.version, ack: true});
                    break;
                }
                case MinerFeatureKey.totalHashrate: {
                    await this.setState(this.getStateFullObjectId(settings, MinerFeatureKey.totalHashrate), {val: stats.totalHashrate, ack: true});
                    break;
                }
            }
        }
    }

    private async createDeviceStateObjects(settings: IOBrokerDeviceSettings): Promise<void> {
        if (!isMiner(settings)) {
            this.log.error(`createDeviceStateObjects category ${settings.category} not yet supported`);
            return;
        }

        await this.extendObject(`${this.getDeviceObjectId(settings)}.${MinerFeatureCategory.control}`, {
            type: 'channel',
            common: {
                name: 'device controls'
            },
        });

        await this.extendObject(`${this.getDeviceObjectId(settings)}.${MinerFeatureCategory.info}`, {
            type: 'channel',
            common: {
                name: 'device information'
            },
        });

        const dummyMiner = createMiner(settings.settings);
        for (const featureKey of dummyMiner.getSupportedFeatures()) {
            const feature = minerFeatures[featureKey];
            await this.extendObject(`${this.getStateFullObjectId(settings, featureKey)}`, {
                type: 'state',
                common: {
                    name: feature.label,
                    type: feature.type as ioBroker.CommonType,
                    read: feature.readable,
                    write: feature.writable
                }
            });
        }
    }

    private getDeviceObjectId(settings: IOBrokerDeviceSettings): string {
        if (!isMiner(settings)) { // TODO: pool support
            this.log.error(`category ${settings.category} is not yet supported.`);
            return 'TODO';
        }

        return `${settings.category}.${settings.mac.replace(/:/g, '')}`;
    }

    private getStateFullObjectId(settings: IOBrokerDeviceSettings, featureKey: MinerFeatureKey): string {
        return `${this.getDeviceObjectId(settings)}.${getMinerFeatureFullId(featureKey)}`;
    }

    private setupMinerLib(): void {
        Logger.setLogger({
            log: (level, message) => {
                switch (level) {
                    case Level.DEBUG:
                        this.log.debug(message);
                        break;
                    case Level.INFO:
                        this.log.info(message);
                        break;
                    case Level.NOTICE:
                        this.log.info(message);
                        break;
                    case Level.WARN:
                        this.log.warn(message);
                        break;
                    case Level.ERROR:
                        this.log.error(message);
                        break;
                    case Level.FATAL:
                        this.log.error(message);
                        break;
                }
            }
        })
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new MinerAdapter(options);
} else {
    // otherwise start the instance directly
    (() => new MinerAdapter())();
}