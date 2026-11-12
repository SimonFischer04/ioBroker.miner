import * as utils from '@iobroker/adapter-core';
import type {} from './lib/adapter-config';
import { I18n } from '@iobroker/adapter-core';
import MinerAdapterDeviceManagement from './lib/MinerAdapterDeviceManagement';
import { categoryKeys } from './lib/miner/model/Category';
import { MinerManager } from './lib/miner/miner/MinerManager';
import type {
    IOBrokerDeviceSettings,
    IOBrokerKnownDeviceSettings,
    IOBrokerMinerSettings,
    IOBrokerPoolSettings,
} from './miner/model/IOBrokerMinerSettings';
import { decryptDeviceSettings, encryptDeviceSettings, isMiner, isPool } from './miner/model/IOBrokerMinerSettings';
import { Level } from './lib/miner/model/Level';
import {
    getMinerFeatureFullId,
    MinerFeatureCategory,
    MinerFeatureKey,
    minerFeatures,
} from './lib/miner/model/MinerFeature';
import { createMiner } from './lib/miner/miner/MinerFactory';
import { createPool } from './lib/miner/pool/PoolFactory';
import { Logger } from './lib/miner/model/Logger';
import { isWithinPowerTargetConstraints, type Miner } from './lib/miner/miner/Miner';
import type { MinerSettings } from './lib/miner/model/MinerSettings';
import type { MinerStats } from './lib/miner/model/MinerStats';
import { asyncDynamicInterval, setTimerBackend, type AsyncIntervalReturnType } from './lib/utils/delay';
import { UpdateSources } from './lib/update/UpdateSources';
import { runUpdateChecks, type UpdateCheckSummary } from './lib/update/runUpdateChecks';
import type { UpdateCheckContext, UpdateCheckResult } from './lib/miner/model/UpdateCheckResult';
import {
    CUSTOM_CHANNEL,
    findDynamicCustomChannel,
    resolveCustomFeatures,
    type CustomChannelDefinition,
    type CustomFeatureNotification,
    type DynamicCustomChannelDefinition,
} from './lib/miner/model/CustomFeature';
import { PoolManager } from './lib/miner/pool/PoolManager';
import type { Pool } from './lib/miner/pool/Pool';
import type { PoolSettings } from './lib/miner/model/PoolSettings';
import type { PoolStats, PoolWorkerStats } from './lib/miner/model/PoolStats';
import { PoolFeatureKey } from './lib/miner/model/PoolFeature';
import {
    getPoolStateObjects,
    getPoolStateValues,
    getWorkerObjectId,
    getWorkerStateObjects,
    getWorkerStateValues,
    poolChannels,
} from './pool/poolStates';

/** First update check shortly after start, once the miners are initialized and reachable. */
const UPDATE_CHECK_INITIAL_DELAY_MS = 60_000;
const UPDATE_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

/**
 *
 */
export class MinerAdapter extends utils.Adapter {
    private readonly deviceManagement: MinerAdapterDeviceManagement;
    public readonly minerManager: MinerManager = new MinerManager();
    public readonly poolManager: PoolManager = new PoolManager();
    private readonly updateSources = new UpdateSources();
    private updateCheckHandle: AsyncIntervalReturnType | undefined;
    /**
     * The devices whose miner is reachable, by object id, with the name `info.connection` lists them by.
     */
    private readonly onlineDevices = new Map<string, string>();
    /**
     * The custom channels whose objects exist, by device object id. Instances of dynamic channels (see
     * DynamicCustomChannelDefinition) are created when a poll first reports them.
     */
    private readonly customChannelObjects = new Map<string, Set<string>>();
    /**
     * The worker channels of a pool that were created or refreshed in this run, by device object id, so a poll
     * doesn't recreate them. A pool without an entry hasn't been polled in this run yet.
     */
    private readonly poolWorkerChannels = new Map<string, Set<string>>();
    /**
     * The last enable/disable in progress per device, see {@link runExclusive}.
     */
    private readonly deviceQueues = new Map<string, Promise<void>>();

    /**
     *
     * @param options - adapter options
     */
    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'miner',
        });
        setTimerBackend({
            schedule: (callback, timeout) => this.setTimeout(callback, timeout),
            clear: timer => this.clearTimeout(timer as ioBroker.Timeout | undefined),
            scheduleInterval: (callback, interval) => this.setInterval(callback, interval),
            clearInterval: timer => this.clearInterval(timer as ioBroker.Interval | undefined),
            delay: timeout => this.delay(timeout),
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

        // Initialize i18n for device management translations
        await I18n.init(__dirname, this);

        // Reset the connection indicator during startup. Before 1.2.0 it was a boolean: existing instances keep their
        // object from the old version, so bring its type in line with the list it holds now
        await this.extendObject('info.connection', {
            common: { type: 'string', role: 'info.status', name: 'List of reachable miners' },
        });
        await this.setState('info.connection', '', true);

        // Initialize your adapter here
        await this.createBasicObjectStructure();

        // try to connect to already known devices
        await this.tryKnownDevices();

        // this is correct RELATIVE path! actually means "miner.X.miner.<minerid>.control"
        this.subscribeStates('miner.*.control.*');
        this.subscribeStates(`miner.*.${CUSTOM_CHANNEL}.*`);
        this.subscribeStates('miner.*.enabled');
        this.subscribeStates('pool.*.enabled');

        this.scheduleUpdateChecks();
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     *
     * @param callback - callback to signal completion
     */
    private async onUnload(callback: () => void): Promise<void> {
        try {
            this.updateCheckHandle?.clear();
            await this.minerManager.closeAll();
            await this.poolManager.closeAll();

            if (this.deviceManagement) {
                await this.deviceManagement.close();
            }

            await this.setState('info.connection', '', true);

            callback();
        } catch {
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
     * @param id - the state id
     * @param state - the new state value
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
            const deviceSettings = decryptDeviceSettings(obj.native as IOBrokerDeviceSettings, value =>
                this.decrypt(value),
            );
            if (!isMiner(deviceSettings) && !isPool(deviceSettings)) {
                this.log.warn(`category ${deviceSettings.category} not yet supported`);
                return;
            }
            deviceSettings.enabled = ((await this.getStateAsync(`${deviceObjectId}.enabled`))?.val ?? true) === true;

            // example: control.running or enabled
            const minerObjectId: string = parts.slice(4).join('.');

            if (minerObjectId === 'enabled') {
                const enabled = state.val === true;
                this.log.info(`${enabled ? 'enable' : 'disable'} requested for device ${deviceSettings.name}`);

                // one after another per device: two requests arriving together would both find the device inactive
                // and initialize it twice, and a disable arriving during an enable would have nothing to close yet
                await this.runExclusive(deviceObjectId, async () => {
                    await this.setDeviceEnabled(deviceObjectId, deviceSettings, enabled);
                    await this.setState(id, { val: enabled, ack: true });
                });
                return;
            }

            if (!isMiner(deviceSettings)) {
                this.log.warn(`unknown handling of state ${id}`);
                return;
            }

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

                case getMinerFeatureFullId(MinerFeatureKey.reboot): {
                    if (!state.val) {
                        return;
                    }
                    this.log.info(`reboot requested for device ${deviceSettings.name}`);

                    if (deviceSettings.settings.id === undefined) {
                        this.log.error(`device ${deviceSettings.name} has no id`);
                        return;
                    }

                    // TODO: implement reboot in MinerManager / Miner base class
                    this.log.warn('reboot is not yet implemented');
                    await this.setState(id, { val: false, ack: true });
                    break;
                }

                case getMinerFeatureFullId(MinerFeatureKey.profile): {
                    const profile = String(state.val);
                    this.log.debug(`profile state changed to ${profile}`);

                    if (deviceSettings.settings.id === undefined) {
                        this.log.error(`device ${deviceSettings.name} has no id`);
                        return;
                    }

                    await this.minerManager.setProfile(deviceSettings.settings.id, profile);
                    await this.setState(id, { val: profile, ack: true });
                    break;
                }

                case getMinerFeatureFullId(MinerFeatureKey.powerTarget): {
                    const powerTarget = Number(state.val);
                    this.log.debug(`power target state changed to ${powerTarget}`);

                    if (!Number.isFinite(powerTarget) || powerTarget <= 0) {
                        this.log.warn(`invalid power target value for device ${deviceSettings.name}: ${state.val}`);
                        return;
                    }

                    // the range the miner reported (see applyPowerTargetConstraints): don't send what it would reject
                    const range = ((await this.getObjectAsync(id)) as ioBroker.StateObject | null | undefined)?.common;
                    if (!isWithinPowerTargetConstraints(powerTarget, range)) {
                        this.log.warn(
                            `power target ${powerTarget} W for device ${deviceSettings.name} is outside the range the miner accepts (${range?.min ?? '?'}-${range?.max ?? '?'} W)`,
                        );
                        return;
                    }

                    // TODO: why this copy pasta??
                    if (deviceSettings.settings.id === undefined) {
                        this.log.error(`device ${deviceSettings.name} has no id`);
                        return;
                    }

                    await this.minerManager.setPowerTarget(deviceSettings.settings.id, powerTarget);
                    await this.setState(id, { val: powerTarget, ack: true });
                    break;
                }

                default: {
                    if (minerObjectId.startsWith(`${CUSTOM_CHANNEL}.`)) {
                        await this.setCustomFeature(
                            id,
                            deviceSettings,
                            minerObjectId.slice(CUSTOM_CHANNEL.length + 1),
                            state.val,
                        );
                        break;
                    }
                    this.log.warn(`unknown handling of state ${id}`);
                }
            }
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }

    /**
     * Sends a write to a custom feature state (`custom.<channel>.<feature>`) to the miner. On success the state is
     * acknowledged; the next poll corrects it should the miner have applied something else.
     *
     * @param stateId - the full id of the written state
     * @param deviceSettings - settings of the device the state belongs to
     * @param featureId - `<channel>.<feature>`
     * @param value - the written value
     */
    private async setCustomFeature(
        stateId: string,
        deviceSettings: IOBrokerMinerSettings,
        featureId: string,
        value: ioBroker.StateValue,
    ): Promise<void> {
        const miner = deviceSettings.settings.id ? this.minerManager.getMiner(deviceSettings.settings.id) : undefined;
        if (!miner) {
            this.log.warn(`cannot set ${featureId} on device ${deviceSettings.name}: the device is disabled`);
            return;
        }

        try {
            const applied = await miner.setCustomFeature(featureId, value);
            await this.setState(stateId, { val: applied, ack: true });
        } catch (e) {
            this.log.warn(`setting ${featureId} on device ${deviceSettings.name} failed: ${String(e)}`);
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
        if (!isMiner(settings) && !isPool(settings)) {
            this.log.error(`category ${settings.category} is not yet supported.`);
            return;
        }

        // TODO: fill settings.mac using arp request
        const id = this.getDeviceObjectId(settings);

        // don't log the settings themselves: they hold passwords and API tokens in clear text here
        this.log.debug(`extending device object ${id}`);
        // strip old (<=v1.0.4) enabled prop from native
        const { enabled: _enabled, ...nativeSettings } = settings;

        await this.extendObject(id, {
            type: 'device',
            common: {
                name: this.getDeviceDisplayName(settings),
            },
            native: encryptDeviceSettings(nativeSettings, value => this.encrypt(value)),
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

    /**
     *
     * @param settings - the device settings to add
     */
    public async addDevice(settings: IOBrokerDeviceSettings): Promise<void> {
        const obj = await this.configureDeviceObject(settings);

        if (obj == null) {
            this.log.error(`could not create device object for ${JSON.stringify(settings)}`);
            return;
        }

        await this.initDevice(obj, isMiner(settings) || isPool(settings) ? settings.enabled : undefined);
    }

    /**
     *
     * @param settings - the updated device settings
     */
    public async updateDevice(settings: IOBrokerDeviceSettings): Promise<void> {
        // PS: don't just delDevice and addDevice, as this would lose all state history, ...

        if (!isMiner(settings) && !isPool(settings)) {
            this.log.error(`category ${settings.category} is not yet supported.`);
            return;
        }

        await this.setState(`${this.getDeviceObjectId(settings)}.enabled`, {
            val: settings.enabled,
            ack: true,
        });

        if (!(await this.tryCloseDevice(settings))) {
            this.log.error(`updateDevice could not close device ${settings.settings.id}`);
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

        if (!isMiner(settings) && !isPool(settings)) {
            this.log.error(`deleteDevice category ${obj.native.category} not yet supported`);
            return false;
        }

        if (!(await this.tryCloseDevice(settings))) {
            this.log.error(`delDevice could not close device ${settings.settings.id}`);
            return false;
        }

        await this.delObjectAsync(deviceId, { recursive: true });
        // deviceId is the full object id here, the set holds the relative one
        const relativeDeviceId = this.getDeviceObjectId(settings);
        this.onlineDevices.delete(relativeDeviceId);
        this.poolWorkerChannels.delete(relativeDeviceId);
        this.customChannelObjects.delete(relativeDeviceId);
        await this.updateConnectionState();

        this.log.info(`${deviceId} deleted`);
        return true;
    }

    private async tryCloseDevice(settings: IOBrokerKnownDeviceSettings): Promise<boolean> {
        if (settings.settings.id === undefined) {
            this.log.error('tryCloseDevice: device id is undefined');
            return false;
        }

        // Whether there is something to close is what the managers say, not `settings.enabled`: the settings of a
        // device being deleted come from its object, which doesn't hold `enabled`, and the ones of a device being
        // updated already hold the new value.
        if (this.isDeviceActive(settings)) {
            await this.closeDevice(settings);
        } else {
            this.log.debug(`tryCloseDevice: nothing to close, ${settings.settings.id} is not active`);
        }
        return true;
    }

    /**
     * Runs tasks for the same device one after another, in the order they were requested. A failed task doesn't
     * keep the following ones from running.
     *
     * @param deviceObjectId - the device the task is for
     * @param task - what to run once the earlier tasks for the device are done
     */
    private runExclusive(deviceObjectId: string, task: () => Promise<void>): Promise<void> {
        const previous = this.deviceQueues.get(deviceObjectId) ?? Promise.resolve();
        const run = previous.then(task);
        const settled = run
            .catch(() => undefined)
            .then(() => {
                if (this.deviceQueues.get(deviceObjectId) === settled) {
                    this.deviceQueues.delete(deviceObjectId);
                }
            });
        this.deviceQueues.set(deviceObjectId, settled);
        return run;
    }

    /**
     * Whether the miner / pool of the device is initialized (connected, polled).
     *
     * @param settings - the device settings
     */
    private isDeviceActive(settings: IOBrokerKnownDeviceSettings): boolean {
        const id = settings.settings.id;
        if (id === undefined) {
            return false;
        }
        return isPool(settings) ? this.poolManager.hasPool(id) : this.minerManager.hasMiner(id);
    }

    /**
     * Unload the miner / pool of the device.
     *
     * @param settings - the device settings
     */
    private async closeDevice(settings: IOBrokerKnownDeviceSettings): Promise<void> {
        const id = settings.settings.id;
        if (id === undefined) {
            return;
        }
        if (isPool(settings)) {
            await this.poolManager.close(id);
        } else {
            await this.minerManager.close(id);
        }
    }

    /**
     * Name used for the device object and in `info.connection`.
     *
     * @param settings - the device settings
     */
    private getDeviceDisplayName(settings: IOBrokerKnownDeviceSettings): string {
        if (settings.name) {
            return settings.name;
        }
        return isPool(settings) ? settings.settings.poolType : settings.settings.host;
    }

    private async initDevice(device: ioBroker.DeviceObject, initialEnabled?: boolean): Promise<void> {
        const settings: IOBrokerDeviceSettings = decryptDeviceSettings(device.native as IOBrokerDeviceSettings, value =>
            this.decrypt(value),
        );
        this.log.debug(`initialising device ${device._id}`);

        if (isPool(settings)) {
            await this.initPoolDevice(device, settings, initialEnabled);
            return;
        }

        if (!isMiner(settings)) {
            this.log.error(`tryKnownDevices category ${settings.category} not yet supported`);
            return;
        }

        await this.createDeviceStateObjects(settings);
        const enabledState = await this.getStateAsync(`${device._id}.enabled`);
        settings.enabled = (enabledState?.val ?? initialEnabled ?? true) as boolean;
        await this.writeStaticInfoStates(settings);

        if (!settings.enabled) {
            this.log.info(`device ${settings.name} is disabled`);
            return;
        }

        try {
            const miner = await this.minerManager.init(settings.settings);

            miner.subscribeToStats(async (stats: MinerStats) => {
                this.log.debug(`received stats: ${JSON.stringify(stats)}`);
                await this.processNewStats(miner, settings, stats);
            });
            miner.subscribeToOnlineStatus(async (online: boolean) => {
                await this.setDeviceOnline(settings, online);
            });
            if (miner.getSupportedFeatures().includes(MinerFeatureKey.powerTarget)) {
                // not awaited: an unreachable miner must not hold up the adapter start
                void this.applyPowerTargetConstraints(miner, settings);
            }
            if (this.config.checkForUpdates !== false) {
                // Devices added or enabled after the daily check need their first result right away.
                // Do not hold up initialization while contacting the miner or its firmware feed.
                void this.checkMinerUpdates([miner]).catch((e: unknown) => {
                    this.log.error(`initial update check failed: ${String(e)}`);
                });
            }
        } catch (e) {
            this.log.error(`could not initialize device ${settings.name || settings.settings.host}: ${String(e)}`);
            await this.setDeviceOnline(settings, false);
        }
    }

    /**
     * Write static info states that come from the device configuration, not from API polling.
     *
     * @param settings - the device settings
     */
    private async writeStaticInfoStates(settings: IOBrokerMinerSettings): Promise<void> {
        const deviceId = this.getDeviceObjectId(settings);
        await this.setState(`${deviceId}.info.minerType`, { val: settings.settings.minerType, ack: true });
        await this.setState(`${deviceId}.info.host`, { val: settings.settings.host, ack: true });
        await this.setState(`${deviceId}.enabled`, { val: settings.enabled, ack: true });
        // Reset online state on startup — will be set to true once the miner responds
        await this.setDeviceOnline(settings, false);
    }

    private async setDeviceEnabled(
        deviceObjectId: string,
        settings: IOBrokerKnownDeviceSettings,
        enabled: boolean,
    ): Promise<void> {
        if (settings.settings.id === undefined) {
            this.log.error(`device ${settings.name} has no id`);
            return;
        }

        if (settings.enabled === enabled && this.isDeviceActive(settings) === enabled) {
            return;
        }

        if (enabled) {
            if (this.isDeviceActive(settings)) {
                return;
            }

            const obj = (await this.getObjectAsync(deviceObjectId)) as ioBroker.DeviceObject | null | undefined;
            if (obj == null) {
                this.log.warn(`Object ${deviceObjectId} not found`);
                return;
            }

            await this.initDevice(obj, enabled);
            return;
        }

        if (this.isDeviceActive(settings)) {
            await this.closeDevice(settings);
        }
        await this.setDeviceOnline(settings, false);
    }

    /**
     * Stores the power target range the miner accepts as min/max of the control state, so the UI can enforce it
     * and out-of-range values are rejected before they reach the miner.
     *
     * @param miner - the initialized miner
     * @param settings - the device settings
     */
    private async applyPowerTargetConstraints(
        miner: Miner<MinerSettings>,
        settings: IOBrokerDeviceSettings,
    ): Promise<void> {
        try {
            const range = await miner.getPowerTargetConstraints();
            if (range) {
                await this.extendObject(this.getStateFullObjectId(settings, MinerFeatureKey.powerTarget), {
                    common: { min: range.min, max: range.max },
                });
            }
        } catch (e) {
            this.log.debug(
                `power target constraints of ${this.getDeviceObjectId(settings)} not available: ${String(e)}`,
            );
        }
    }

    /**
     * Writes a device's `info.online` and keeps the instance's `info.connection` in sync with it.
     *
     * @param settings - the device settings
     * @param online - whether the device's miner is reachable
     */
    private async setDeviceOnline(settings: IOBrokerDeviceSettings, online: boolean): Promise<void> {
        const deviceId = this.getDeviceObjectId(settings);
        await this.setState(`${deviceId}.info.online`, { val: online, ack: true });
        if (online) {
            this.onlineDevices.set(
                deviceId,
                isMiner(settings) || isPool(settings) ? this.getDeviceDisplayName(settings) : deviceId,
            );
        } else {
            this.onlineDevices.delete(deviceId);
        }
        await this.updateConnectionState();
    }

    /**
     * Lists the reachable miners in `info.connection`, comma-separated like other multi-device adapters (e.g. sonoff)
     * do: the admin shows the instance green while the list is not empty, and shows the list itself. Green needs just
     * one reachable miner - requiring all would turn it yellow whenever a single miner is switched off, e.g. at night.
     */
    private async updateConnectionState(): Promise<void> {
        const names = [...this.onlineDevices.values()].sort((a, b) => a.localeCompare(b));
        await this.setStateChangedAsync('info.connection', { val: names.join(','), ack: true });
    }

    private async processNewStats(
        miner: Miner<MinerSettings>,
        settings: IOBrokerDeviceSettings,
        stats: MinerStats,
    ): Promise<void> {
        // TODO: cleanup, just filter for info features and then directly infer object id from there somehow
        // change MinerStates to Record<MinerFeatureKey, val>?

        const supported = miner.getSupportedFeatures();
        const deviceId = this.getDeviceObjectId(settings);

        // Feature-driven states (version, firmwareVersion, raw)
        if (supported.includes(MinerFeatureKey.version) && stats.version !== undefined) {
            await this.setState(this.getStateFullObjectId(settings, MinerFeatureKey.version), {
                val: stats.version,
                ack: true,
            });
        }
        if (supported.includes(MinerFeatureKey.firmwareVersion) && stats.firmwareVersion !== undefined) {
            await this.setState(this.getStateFullObjectId(settings, MinerFeatureKey.firmwareVersion), {
                val: stats.firmwareVersion,
                ack: true,
            });
        }
        if (supported.includes(MinerFeatureKey.rawStats) && stats.raw !== undefined) {
            await this.setState(this.getStateFullObjectId(settings, MinerFeatureKey.rawStats), {
                val: JSON.stringify(stats.raw),
                ack: true,
            });
        }
        if (supported.includes(MinerFeatureKey.powerTarget) && stats.powerTarget !== undefined) {
            // reflect the configured target, also when it was changed elsewhere (e.g. in the miner's web interface);
            // only on change, so a poll doesn't rewrite the control state every few seconds
            await this.setStateChangedAsync(this.getStateFullObjectId(settings, MinerFeatureKey.powerTarget), {
                val: stats.powerTarget,
                ack: true,
            });
        }
        if (supported.includes(MinerFeatureKey.profile) && stats.profile !== undefined) {
            // like the power target: reflect the active profile, also when it was changed elsewhere, only on change
            await this.setStateChangedAsync(this.getStateFullObjectId(settings, MinerFeatureKey.profile), {
                val: stats.profile,
                ack: true,
            });
        }
        if (supported.includes(MinerFeatureKey.rssi) && stats.rssi !== undefined) {
            await this.setState(this.getStateFullObjectId(settings, MinerFeatureKey.rssi), {
                val: stats.rssi,
                ack: true,
            });
        }
        // Stats sub-states: write whatever the miner provides
        if (supported.includes(MinerFeatureKey.stats)) {
            const statsValues: Record<string, ioBroker.StateValue | undefined> = {
                totalHashrate: stats.totalHashrate,
                power: stats.power,
                dynamicPowerTarget: stats.dynamicPowerTarget,
                efficiency: stats.efficiency,
                acceptedShares: stats.acceptedShares,
                rejectedShares: stats.rejectedShares,
            };
            for (const [key, val] of Object.entries(statsValues)) {
                if (val !== undefined) {
                    await this.setState(`${deviceId}.stats.${key}`, { val, ack: true });
                }
            }
        }

        // Custom features: only the ones the miner declares, only on change (like the power target above)
        if (stats.custom) {
            const channels = miner.getCustomChannels();
            await this.createNewCustomChannels(deviceId, channels);
            const known = new Map(resolveCustomFeatures(channels).map(f => [f.id, f.feature]));
            for (const [id, val] of Object.entries(stats.custom)) {
                const feature = known.get(id);
                if (!feature) {
                    continue;
                }
                const stateId = `${deviceId}.${CUSTOM_CHANNEL}.${id}`;
                if (feature.notification && val === true) {
                    // compare with the stored value, so the notification is raised once when the feature turns true,
                    // not on every poll or adapter restart
                    const wasTrue = (await this.getStateAsync(stateId))?.val === true;
                    if (!wasTrue && isMiner(settings)) {
                        await this.raiseCustomFeatureNotification(settings, feature.notification);
                    }
                }
                await this.setStateChangedAsync(stateId, { val, ack: true });
            }
        }

        // Always update online / lastSeen
        await this.setDeviceOnline(settings, true);
        await this.setState(`${deviceId}.info.lastSeen`, { val: Date.now(), ack: true });
    }

    /**
     * Raises the notification a custom feature declares, and logs it as a warning (for js-controllers without
     * notification support, and for the log).
     *
     * @param settings - the device the feature belongs to
     * @param notification - the notification the feature declares
     */
    private async raiseCustomFeatureNotification(
        settings: IOBrokerMinerSettings,
        notification: CustomFeatureNotification,
    ): Promise<void> {
        const message = `Miner "${settings.name}": ${notification.message}`;
        this.log.warn(message);
        try {
            await this.registerNotification(
                'miner',
                notification.category as ioBroker.NotificationScopes['miner'],
                message,
            );
        } catch (e) {
            this.log.debug(`could not register notification: ${String(e)}`);
        }
    }

    private async createDeviceStateObjects(settings: IOBrokerDeviceSettings): Promise<void> {
        if (!isMiner(settings)) {
            this.log.error(`createDeviceStateObjects category ${settings.category} not yet supported`);
            return;
        }

        const deviceId = this.getDeviceObjectId(settings);

        // Create channels for all feature categories
        const categoryLabels: Record<MinerFeatureCategory, string> = {
            [MinerFeatureCategory.control]: 'device controls',
            [MinerFeatureCategory.info]: 'device information',
            [MinerFeatureCategory.stats]: 'mining statistics',
            [MinerFeatureCategory.raw]: 'raw API data',
        };

        for (const category of Object.values(MinerFeatureCategory)) {
            await this.extendObject(`${deviceId}.${category}`, {
                type: 'channel',
                common: {
                    name: categoryLabels[category],
                },
            });
        }

        // Clean up legacy state paths from pre-restructure versions
        await this.cleanupLegacyStates(deviceId);

        // Always present enabled state
        await this.extendObject(`${deviceId}.enabled`, {
            type: 'state',
            common: {
                name: 'Enabled',
                type: 'boolean',
                role: 'switch.enable',
                read: true,
                write: true,
            },
        });

        // --- Always-present info states (not feature-gated) ---
        const infoStates: Record<string, Partial<ioBroker.StateCommon>> = {
            minerType: { name: 'Miner Type', type: 'string', read: true, write: false },
            host: { name: 'Host', type: 'string', read: true, write: false },
            online: { name: 'Online', type: 'boolean', role: 'indicator.reachable', read: true, write: false },
            lastSeen: { name: 'Last Seen', type: 'number', role: 'date', read: true, write: false },
        };
        for (const [id, common] of Object.entries(infoStates)) {
            await this.extendObject(`${deviceId}.info.${id}`, {
                type: 'state',
                common: common as ioBroker.StateCommon,
            });
        }

        // --- Always-present stats sub-states (created when miner declares MinerFeatureKey.stats) ---
        const dummyMiner = createMiner(settings.settings);
        const supportedFeatures = dummyMiner.getSupportedFeatures();

        if (supportedFeatures.includes(MinerFeatureKey.stats)) {
            const statsStates: Record<string, Partial<ioBroker.StateCommon>> = {
                totalHashrate: { name: 'Total Hashrate', type: 'number', unit: 'h/s', read: true, write: false },
                power: { name: 'Power', type: 'number', unit: 'W', read: true, write: false },
                dynamicPowerTarget: {
                    name: 'Dynamic Power Target',
                    type: 'number',
                    unit: 'W',
                    read: true,
                    write: false,
                },
                efficiency: { name: 'Efficiency', type: 'number', unit: 'H/W', read: true, write: false },
                acceptedShares: { name: 'Accepted Shares', type: 'number', read: true, write: false },
                rejectedShares: { name: 'Rejected Shares', type: 'number', read: true, write: false },
            };
            for (const [id, common] of Object.entries(statsStates)) {
                await this.extendObject(`${deviceId}.stats.${id}`, {
                    type: 'state',
                    common: common as ioBroker.StateCommon,
                });
            }
        }

        // --- Feature-driven states (control, info.version, raw) ---
        for (const featureKey of supportedFeatures) {
            // Skip the 'stats' capability marker — sub-states handled above
            if (featureKey === MinerFeatureKey.stats) {
                continue;
            }
            const feature = minerFeatures[featureKey];
            const common: Partial<ioBroker.StateCommon> = {
                name: `${feature.label} - ${feature.description}`,
                type: feature.type as ioBroker.CommonType,
                role: feature.role,
                read: feature.readable,
                write: feature.writable,
                unit: feature.unit,
                expert: feature.advanced === true ? true : undefined, // false needs to be passed in as undefined
            };

            // Profile feature: populate allowed values from the miner so ioBroker renders a dropdown
            if (featureKey === MinerFeatureKey.profile) {
                const profiles = dummyMiner.getProfiles();
                if (profiles.length > 0) {
                    const states: Record<string, string> = {};
                    for (const p of profiles) {
                        states[p] = p;
                    }
                    common.states = states;
                }
            }

            await this.extendObject(`${this.getStateFullObjectId(settings, featureKey)}`, {
                type: 'state',
                common: common as ioBroker.StateCommon,
            });
        }

        await this.createCustomStateObjects(
            deviceId,
            dummyMiner.getCustomChannels(),
            dummyMiner.getDynamicCustomChannels(),
        );
    }

    /**
     * Creates the `custom` channel with one sub-channel per custom feature channel the miner declares, and removes
     * custom objects the miner no longer declares (another miner type, or a feature promoted to a regular one).
     *
     * Instances of dynamic channels (e.g. one per hashboard) are only known after a poll: their objects are kept
     * here as long as the miner declares their template, and created by {@link createNewCustomChannels}.
     *
     * @param deviceId - the device object id
     * @param channels - the custom feature channels of the miner
     * @param dynamicChannels - the templates of the miner's dynamic custom channels
     */
    private async createCustomStateObjects(
        deviceId: string,
        channels: readonly CustomChannelDefinition[],
        dynamicChannels: readonly DynamicCustomChannelDefinition[] = [],
    ): Promise<void> {
        const customId = `${deviceId}.${CUSTOM_CHANNEL}`;
        const wanted = new Set<string>();
        this.customChannelObjects.set(deviceId, new Set());

        if (channels.length > 0 || dynamicChannels.length > 0) {
            await this.extendObject(customId, {
                type: 'channel',
                common: { name: 'device specific features' },
            });
            wanted.add(customId);
        }
        for (const channel of channels) {
            for (const id of await this.createCustomChannelObjects(deviceId, channel)) {
                wanted.add(id);
            }
        }

        // longest ids first, so states go before their channels
        const existing = Object.keys(await this.getForeignObjectsAsync(`${this.namespace}.${customId}.*`))
            .map(id => id.slice(this.namespace.length + 1))
            .concat((await this.getObjectAsync(customId)) ? [customId] : [])
            .sort((a, b) => b.length - a.length);
        for (const id of existing) {
            if (!wanted.has(id) && !this.isDynamicCustomObject(customId, id, dynamicChannels)) {
                this.log.info(`Removing custom feature object no longer provided by the miner: ${id}`);
                await this.delObjectAsync(id);
            }
        }
    }

    /**
     * Creates the objects of custom channels the miner reports for the first time, e.g. a hashboard it detected.
     * Channels it no longer reports are left alone: a board can be missing from a single poll.
     *
     * @param deviceId - the device object id
     * @param channels - the custom feature channels the miner currently declares
     */
    private async createNewCustomChannels(
        deviceId: string,
        channels: readonly CustomChannelDefinition[],
    ): Promise<void> {
        let created = this.customChannelObjects.get(deviceId);
        if (!created) {
            created = new Set();
            this.customChannelObjects.set(deviceId, created);
        }
        for (const channel of channels) {
            if (!created.has(channel.id)) {
                await this.createCustomChannelObjects(deviceId, channel);
            }
        }
    }

    /**
     * Creates the objects of one custom channel and its features.
     *
     * @param deviceId - the device object id
     * @param channel - the channel
     * @returns the ids of the created objects
     */
    private async createCustomChannelObjects(deviceId: string, channel: CustomChannelDefinition): Promise<string[]> {
        const channelId = `${deviceId}.${CUSTOM_CHANNEL}.${channel.id}`;
        await this.extendObject(channelId, { type: 'channel', common: { name: channel.label } });
        const ids = [channelId];

        for (const feature of channel.features) {
            const common: Partial<ioBroker.StateCommon> = {
                name: `${feature.label} - ${feature.description}`,
                type: feature.type,
                role: feature.role ?? 'state',
                read: feature.readable,
                write: feature.writable,
                unit: feature.unit,
                min: feature.min,
                max: feature.max,
                step: feature.step,
                states: feature.states,
                expert: feature.advanced === true ? true : undefined, // false needs to be passed in as undefined
            };
            const stateId = `${channelId}.${feature.id}`;
            await this.extendObject(stateId, { type: 'state', common: common as ioBroker.StateCommon });
            ids.push(stateId);
        }

        this.customChannelObjects.get(deviceId)?.add(channel.id);
        return ids;
    }

    /**
     * Whether an object below `custom` belongs to an instance of a dynamic channel the miner declares: the channel
     * itself, or one of the template's features.
     *
     * @param customId - the device's custom channel id
     * @param id - the object id
     * @param dynamicChannels - the templates of the miner's dynamic custom channels
     */
    private isDynamicCustomObject(
        customId: string,
        id: string,
        dynamicChannels: readonly DynamicCustomChannelDefinition[],
    ): boolean {
        if (!id.startsWith(`${customId}.`)) {
            return false;
        }
        const [channelId, featureId, ...rest] = id.slice(customId.length + 1).split('.');
        const template = findDynamicCustomChannel(dynamicChannels, channelId);
        if (!template || rest.length > 0) {
            return false;
        }
        return featureId === undefined || template.features.some(feature => feature.id === featureId);
    }

    /**
     * Remove orphaned state objects from legacy object model (before category restructure).
     * Old paths: control.MINER_RUNNING, info.RAW, info.VERSION, info.TOTAL_HASHRATE
     *
     * @param deviceId - the device object id prefix
     */
    private async cleanupLegacyStates(deviceId: string): Promise<void> {
        const legacyPaths = [
            `${deviceId}.control.MINER_RUNNING`,
            `${deviceId}.info.RAW`,
            `${deviceId}.info.VERSION`,
            `${deviceId}.info.TOTAL_HASHRATE`,
        ];

        for (const legacyPath of legacyPaths) {
            try {
                const obj = await this.getObjectAsync(legacyPath);
                if (obj) {
                    this.log.info(`Removing legacy state object: ${legacyPath}`);
                    await this.delObjectAsync(legacyPath);
                }
            } catch {
                // Object doesn't exist or can't be deleted — ignore
            }
        }
    }

    /**
     * Create the states of a pool account and start polling it, unless it is disabled.
     *
     * @param device - the device object
     * @param settings - the decrypted pool settings
     * @param initialEnabled - whether the device is enabled, if its `enabled` state doesn't exist yet
     */
    private async initPoolDevice(
        device: ioBroker.DeviceObject,
        settings: IOBrokerPoolSettings,
        initialEnabled?: boolean,
    ): Promise<void> {
        let pool: Pool<PoolSettings>;
        try {
            await this.createPoolStateObjects(settings);
            const enabledState = await this.getStateAsync(`${device._id}.enabled`);
            settings.enabled = (enabledState?.val ?? initialEnabled ?? true) as boolean;

            const deviceId = this.getDeviceObjectId(settings);
            await this.setState(`${deviceId}.info.poolType`, { val: settings.settings.poolType, ack: true });
            await this.setState(`${deviceId}.enabled`, { val: settings.enabled, ack: true });
            await this.setDeviceOnline(settings, false);

            if (!settings.enabled) {
                this.log.info(`pool ${settings.name} is disabled`);
                return;
            }

            if (settings.settings.id !== undefined && this.poolManager.hasPool(settings.settings.id)) {
                this.log.debug(`pool ${settings.settings.id} is already initialized`);
                return;
            }
            pool = await this.poolManager.init(settings.settings);
        } catch (e) {
            this.log.error(`could not initialize pool ${settings.name || settings.settings.poolType}: ${String(e)}`);
            return;
        }

        pool.subscribeToStats(async (stats: PoolStats) => {
            await this.processNewPoolStats(pool, settings, stats);
        });
        pool.subscribeToOnlineStatus(async (online: boolean) => {
            await this.setDeviceOnline(settings, online);
        });
    }

    private async createPoolStateObjects(settings: IOBrokerPoolSettings): Promise<void> {
        const deviceId = this.getDeviceObjectId(settings);
        const features = createPool(settings.settings).getSupportedFeatures();

        for (const [channel, name] of Object.entries(poolChannels)) {
            if (channel === 'workers' && !features.includes(PoolFeatureKey.workers)) {
                continue;
            }
            if (channel === 'raw' && !features.includes(PoolFeatureKey.rawStats)) {
                continue;
            }
            if (channel === 'rewards' && !features.includes(PoolFeatureKey.rewards)) {
                continue;
            }
            await this.extendObject(`${deviceId}.${channel}`, { type: 'channel', common: { name } });
        }

        await this.extendObject(`${deviceId}.enabled`, {
            type: 'state',
            common: { name: 'Enabled', type: 'boolean', role: 'switch.enable', read: true, write: true },
        });

        for (const [id, common] of Object.entries(getPoolStateObjects(features))) {
            await this.extendObject(`${deviceId}.${id}`, { type: 'state', common });
        }
    }

    private async processNewPoolStats(
        pool: Pool<PoolSettings>,
        settings: IOBrokerPoolSettings,
        stats: PoolStats,
    ): Promise<void> {
        const deviceId = this.getDeviceObjectId(settings);
        const features = pool.getSupportedFeatures();

        for (const [id, val] of Object.entries(getPoolStateValues(stats, features))) {
            await this.setState(`${deviceId}.${id}`, { val, ack: true });
        }

        if (features.includes(PoolFeatureKey.workers) && stats.workers !== undefined) {
            await this.writePoolWorkers(deviceId, stats.workers, stats.username);
        }

        await this.setDeviceOnline(settings, true);
        await this.setState(`${deviceId}.info.lastSeen`, { val: Date.now(), ack: true });
    }

    /**
     * Writes the states of the workers a pool reported: creates the channel of a worker that is new, and removes the
     * channel of one the pool no longer reports (deleted or renamed there), so it doesn't stay behind with its last
     * state and hashrate.
     *
     * @param deviceId - object id of the pool device
     * @param workers - all workers of the account
     * @param username - the account's username, if known
     */
    private async writePoolWorkers(deviceId: string, workers: PoolWorkerStats[], username?: string): Promise<void> {
        const reported = new Map(
            workers.map(worker => [`${deviceId}.workers.${getWorkerObjectId(worker.name, username)}`, worker]),
        );

        let created = this.poolWorkerChannels.get(deviceId);
        // first poll of this run: the channels of earlier runs are the ones to check for removed workers
        const existing = created ?? (await this.getPoolWorkerChannelIds(deviceId));
        if (!created) {
            created = new Set();
            this.poolWorkerChannels.set(deviceId, created);
        }
        for (const workerId of existing) {
            if (!reported.has(workerId)) {
                this.log.info(`Removing worker no longer reported by the pool: ${workerId}`);
                await this.delObjectAsync(workerId, { recursive: true });
                created.delete(workerId);
            }
        }

        for (const [workerId, worker] of reported) {
            if (!created.has(workerId)) {
                await this.extendObject(workerId, { type: 'channel', common: { name: worker.name } });
                for (const [id, common] of Object.entries(getWorkerStateObjects())) {
                    await this.extendObject(`${workerId}.${id}`, { type: 'state', common });
                }
                created.add(workerId);
            }
            for (const [id, val] of Object.entries(getWorkerStateValues(worker))) {
                await this.setState(`${workerId}.${id}`, { val, ack: true });
            }
        }
    }

    /**
     * The worker channels that exist below a pool device, as relative object ids.
     *
     * @param deviceId - object id of the pool device
     */
    private async getPoolWorkerChannelIds(deviceId: string): Promise<string[]> {
        const prefix = `${deviceId}.workers.`;
        return (
            Object.keys(await this.getForeignObjectsAsync(`${this.namespace}.${prefix}*`, 'channel'))
                .map(id => id.slice(this.namespace.length + 1))
                // the worker channels only, nothing below them
                .filter(id => !id.slice(prefix.length).includes('.'))
        );
    }

    private scheduleUpdateChecks(): void {
        // instances created before the setting existed have no value for it: treat that as the default (on)
        if (this.config.checkForUpdates === false) {
            this.log.info('automatic update checks are turned off in the instance settings');
            return;
        }

        this.updateCheckHandle = asyncDynamicInterval(async () => {
            try {
                await this.checkForUpdates();
            } catch (e) {
                // an error escaping here would end the daily schedule
                this.log.error(`update check failed: ${String(e)}`);
            }
            return UPDATE_CHECK_INTERVAL_MS;
        }, UPDATE_CHECK_INITIAL_DELAY_MS);
    }

    /**
     * Checks running miners and configured BOS/Avalon devices for a newer firmware/software version and updates their
     * `info.latestVersion` / `info.updateAvailable` states. A failed check sets both to null (unknown).
     *
     * @param options - `force` skips the cached upstream lookups, e.g. for a manual check
     * @param options.force - ask the upstream sources again instead of using cached results
     * @returns how many miners were checked, have an update, or failed
     */
    public async checkForUpdates(options: { force?: boolean } = {}): Promise<UpdateCheckSummary> {
        if (options.force) {
            this.updateSources.clearCache();
        }

        const running = this.minerManager.getMiners();
        const inactive: Miner<MinerSettings>[] = [];
        // Firmware feeds can be checked from saved identity data even when a device is disabled.
        for (const device of await this.getDevicesAsync()) {
            const settings = device.native as IOBrokerDeviceSettings;
            if (
                isMiner(settings) &&
                ['bos', 'avalonMiner'].includes(settings.settings.minerType) &&
                !running.some(miner => miner.settings.id === settings.settings.id)
            ) {
                const decrypted = decryptDeviceSettings(settings, value =>
                    this.decrypt(value),
                ) as IOBrokerMinerSettings;
                inactive.push(createMiner(decrypted.settings));
            }
        }
        try {
            return await this.checkMinerUpdates([...running, ...inactive]);
        } finally {
            await Promise.all(inactive.map(miner => miner.close()));
        }
    }

    private async checkMinerUpdates(miners: readonly Miner<MinerSettings>[]): Promise<UpdateCheckSummary> {
        const summary = await runUpdateChecks(
            miners,
            this.updateSources,
            async (miner, result, error) => {
                const deviceId = this.getMinerDeviceObjectId(miner);
                if (error !== undefined) {
                    const reason = error instanceof Error ? error.message : JSON.stringify(error);
                    this.log.warn(`update check for ${deviceId} failed: ${reason}`);
                } else if (result.updateAvailable === true) {
                    this.log.info(
                        `update available for ${deviceId}: ${result.installedVersion ?? '?'} -> ${result.latestVersion ?? '?'}`,
                    );
                }

                try {
                    await this.writeUpdateStates(deviceId, miner, result);
                } catch (e) {
                    // keep checking the remaining miners
                    this.log.error(`could not write update states for ${deviceId}: ${String(e)}`);
                }
            },
            miner => this.getUpdateCheckContext(miner),
        );

        this.log.debug(`update check finished: ${JSON.stringify(summary)}`);
        return summary;
    }

    private async getUpdateCheckContext(miner: Miner<MinerSettings>): Promise<UpdateCheckContext> {
        const deviceId = this.getMinerDeviceObjectId(miner);
        const [raw, installed, online] = await Promise.all([
            this.getStateAsync(`${deviceId}.${getMinerFeatureFullId(MinerFeatureKey.rawStats)}`),
            this.getStateAsync(`${deviceId}.${getMinerFeatureFullId(miner.getInstalledVersionFeature())}`),
            this.getStateAsync(`${deviceId}.info.online`),
        ]);
        let rawStats: object | undefined;
        if (typeof raw?.val === 'string') {
            try {
                const parsed: unknown = JSON.parse(raw.val);
                if (parsed && typeof parsed === 'object') {
                    rawStats = parsed;
                }
            } catch {
                this.log.debug(`ignoring invalid stored raw stats for ${deviceId}`);
            }
        }
        return {
            online: this.minerManager.getMiners().includes(miner) && online?.val === true,
            lastStats: {
                raw: rawStats,
                firmwareVersion: typeof installed?.val === 'string' ? installed.val : undefined,
            },
        };
    }

    private async writeUpdateStates(
        deviceId: string,
        miner: Miner<MinerSettings>,
        result: UpdateCheckResult,
    ): Promise<void> {
        const supported = miner.getSupportedFeatures();
        const values: [MinerFeatureKey, ioBroker.StateValue][] = [
            [MinerFeatureKey.latestVersion, result.latestVersion ?? null],
            [MinerFeatureKey.updateAvailable, result.updateAvailable ?? null],
            [MinerFeatureKey.autoUpgrade, result.autoUpgrade?.enabled ?? null],
            [MinerFeatureKey.autoUpgradeNextRun, result.autoUpgrade?.nextRun ?? null],
        ];
        for (const [key, val] of values) {
            if (supported.includes(key)) {
                await this.setState(`${deviceId}.${getMinerFeatureFullId(key)}`, { val, ack: true });
            }
        }
    }

    private getMinerDeviceObjectId(miner: Miner<MinerSettings>): string {
        // same id scheme as getDeviceObjectId() for devices of the 'miner' category
        const category: (typeof categoryKeys)[number] = 'miner';
        return `${category}.${miner.settings.id}`;
    }

    private getDeviceObjectId(settings: IOBrokerDeviceSettings): string {
        if (!isMiner(settings) && !isPool(settings)) {
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
