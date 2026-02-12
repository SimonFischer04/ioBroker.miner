import * as utils from '@iobroker/adapter-core';
import MinerAdapterDeviceManagement from './lib/MinerAdapterDeviceManagement';
import { categoryKeys } from './lib/miner/model/Category';
import { MinerManager } from './lib/miner/miner/MinerManager';
import type { IOBrokerDeviceSettings, IOBrokerMinerSettings } from './miner/model/IOBrokerMinerSettings';
import { decryptDeviceSettings, encryptDeviceSettings, isMiner } from './miner/model/IOBrokerMinerSettings';
import { Level } from './lib/miner/model/Level';
import {
    getMinerFeatureFullId,
    MinerFeatureCategory,
    MinerFeatureKey,
    minerFeatures,
} from './lib/miner/model/MinerFeature';
import { createMiner } from './lib/miner/miner/MinerFactory';
import { Logger } from './lib/miner/model/Logger';
import type { Miner } from './lib/miner/miner/Miner';
import type { MinerSettings } from './lib/miner/model/MinerSettings';
import type { MinerStats } from './lib/miner/model/MinerStats';

export class MinerAdapter extends utils.Adapter {
    private readonly deviceManagement: MinerAdapterDeviceManagement;
    public readonly minerManager: MinerManager = new MinerManager();

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
        this.log.info(`aconfig option1: ${this.config.option1}`);
        this.log.info(`config option2: ${this.config.option2}`);
        console.log('testABC');

        // try to connect to already known devices
        await this.tryKnownDevices();

        this.subscribeStates('miner.*.control.*');
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     *
     * @param callback
     */
    private async onUnload(callback: () => void): Promise<void> {
        try {
            await this.minerManager.closeAll();

            if (this.deviceManagement) {
                await this.deviceManagement.close();
            }

            callback();
        } catch (_e) {
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
     *
     * @param id
     * @param state
     */
    private async onStateChange(id: string, state: ioBroker.State | null | undefined): Promise<void> {
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);

            // adapters usually should not process ack=true messages
            if (state.ack) {
                return;
            }

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
                    await this.setState(id, { val: state.val, ack: true });
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
                    name: key,
                },
                native: {},
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

    private async configureDeviceObject(settings: IOBrokerDeviceSettings): Promise<ioBroker.DeviceObject | undefined> {
        if (!isMiner(settings)) {
            // TODO: pool support
            this.log.error(`category ${settings.category} is not yet supported.`);
            return;
        }

        // TODO: fill settings.mac using arp request
        const id = this.getDeviceObjectId(settings);

        this.log.debug(`extended object ${id} with: ${JSON.stringify(settings)}`);
        await this.extendObject(id, {
            type: 'device',
            common: {
                name: settings.name || settings.settings.host,
            },
            native: encryptDeviceSettings(settings, value => this.encrypt(value)),
        });

        // always add empty state, so that getObjectAsync works
        await this.extendObject(`${id}.empty`, {
            type: 'state',
            common: {
                name: 'empty',
                type: 'string',
                read: true,
                write: true,
                expert: true,
            },
        });

        const obj: ioBroker.DeviceObject = (await this.getObjectAsync(id)) as ioBroker.DeviceObject;
        this.log.debug(`configureDeviceObject: ${JSON.stringify(obj)}`);

        return obj;
    }

    public async addDevice(settings: IOBrokerDeviceSettings): Promise<void> {
        const obj = await this.configureDeviceObject(settings);

        if (obj == null) {
            this.log.error(`could not create device object for ${JSON.stringify(settings)}`);
            return;
        }

        await this.initDevice(obj);
    }

    public async updateDevice(settings: IOBrokerDeviceSettings): Promise<void> {
        // PS: don't just delDevice and addDevice, as this would lose all state history, ...

        if (!isMiner(settings)) {
            // TODO: pool support
            this.log.error(`category ${settings.category} is not yet supported.`);
            return;
        }

        if (!(await this.tryCloseMiner(settings))) {
            this.log.error(`updateDevice could not close miner ${settings.settings.id}`);
            return;
        }

        await this.addDevice(settings);
    }

    /**
     * Deletes a device
     *
     * @param deviceId - The ioBroker-object-id of the device to delete
     */
    public async delDevice(deviceId: string): Promise<boolean> {
        this.log.info(`deleteDevice device ${deviceId}`);
        const obj = await this.getObjectAsync(deviceId);

        if (obj == null) {
            this.log.error(`deleteDevice device ${deviceId} not found`);
            return false;
        }

        const settings: IOBrokerDeviceSettings = decryptDeviceSettings(obj.native as IOBrokerDeviceSettings, value =>
            this.decrypt(value),
        );

        if (!isMiner(settings)) {
            // TODO: pool support
            this.log.error(`deleteDevice category ${obj.native.category} not yet supported`);
            return false;
        }

        if (!(await this.tryCloseMiner(settings))) {
            this.log.error(`delDevice could not close miner ${settings.settings.id}`);
            return false;
        }

        await this.delObjectAsync(deviceId, { recursive: true });

        this.log.info(`${deviceId} deleted`);
        return true;
    }

    private async tryCloseMiner(settings: IOBrokerMinerSettings): Promise<boolean> {
        if (settings.settings.id === undefined) {
            this.log.error('tryCloseMiner: minerId is undefined');
            return false;
        }

        if (!settings.enabled) {
            this.log.debug(`tryCloseMiner: skipped miner close, because ${settings.settings.id} is disabled`);

            if (this.minerManager.hasMiner(settings.settings.id)) {
                this.log.error(
                    `tryCloseMiner: this should not happen, miner ${settings.settings.id} is disabled but still in minerManager`,
                );
                await this.minerManager.close(settings.settings.id);
            }

            return true;
        }

        await this.minerManager.close(settings.settings.id);
        return true;
    }

    private async initDevice(device: ioBroker.DeviceObject): Promise<void> {
        const settings: IOBrokerDeviceSettings = decryptDeviceSettings(device.native as IOBrokerDeviceSettings, value =>
            this.decrypt(value),
        );
        this.log.info(`initialising device ${JSON.stringify(settings)}`);

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

    private async processNewStats(
        miner: Miner<MinerSettings>,
        settings: IOBrokerDeviceSettings,
        stats: MinerStats,
    ): Promise<void> {
        for (const feature of miner.getSupportedFeatures()) {
            // TODO: cleanup, just filter for info features and then directly infer object id from there somehow
            // change MinerStates to Record<MinerFeatureKey, val>?
            switch (feature) {
                case MinerFeatureKey.rawStats: {
                    await this.setState(this.getStateFullObjectId(settings, MinerFeatureKey.rawStats), {
                        val: JSON.stringify(stats.raw),
                        ack: true,
                    });
                    break;
                }
                case MinerFeatureKey.version: {
                    await this.setState(this.getStateFullObjectId(settings, MinerFeatureKey.version), {
                        val: stats.version,
                        ack: true,
                    });
                    break;
                }
                case MinerFeatureKey.totalHashrate: {
                    await this.setState(this.getStateFullObjectId(settings, MinerFeatureKey.totalHashrate), {
                        val: stats.totalHashrate,
                        ack: true,
                    });
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
                name: 'device controls',
            },
        });

        await this.extendObject(`${this.getDeviceObjectId(settings)}.${MinerFeatureCategory.info}`, {
            type: 'channel',
            common: {
                name: 'device information',
            },
        });

        const dummyMiner = createMiner(settings.settings);
        for (const featureKey of dummyMiner.getSupportedFeatures()) {
            const feature = minerFeatures[featureKey];
            await this.extendObject(`${this.getStateFullObjectId(settings, featureKey)}`, {
                type: 'state',
                common: {
                    name: `${feature.label} - ${feature.description}`,
                    type: feature.type as ioBroker.CommonType,
                    read: feature.readable,
                    write: feature.writable,
                    unit: feature.unit,
                    expert: feature.advanced === true ? true : undefined, // false needs to be passed in as undefined
                },
            });
        }
    }

    private getDeviceObjectId(settings: IOBrokerDeviceSettings): string {
        if (!isMiner(settings)) {
            // TODO: pool support
            this.log.error(`category ${settings.category} is not yet supported.`);
            return '<unsupported>';
        }

        // TODO: cleanup?. don't use mac, use id. allows to use multiple miners with same mac (f.e. running trm && xmrig on same device)
        // return `${settings.category}.${settings.mac.replace(/:/g, '')}`;
        return `${settings.category}.${settings.settings.id}`;
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
            },
        });
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new MinerAdapter(options);
} else {
    // otherwise start the instance directly
    (() => new MinerAdapter())();
}
