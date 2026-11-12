import { expect } from 'chai';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
import { resetTimerBackend } from './lib/utils/delay';
import { MinerFeatureKey } from './lib/miner/model/MinerFeature';
import type { MinerAdapter } from './main';
import type { ConfigItemAny, DeviceControl } from '@iobroker/dm-utils';
import { BOS } from './lib/miner/miner/BOS';
import { UpdateSources } from './lib/update/UpdateSources';
import { AvalonMiner } from './lib/miner/miner/AvalonMiner';
import type { CustomChannelDefinition, DynamicCustomChannelDefinition } from './lib/miner/model/CustomFeature';
import { PoolFeatureKey } from './lib/miner/model/PoolFeature';
import type { PoolStats } from './lib/miner/model/PoolStats';

/** Only the adapter dependencies used by initialization and update checks. */
class AdapterMock extends EventEmitter {
    config = { checkForUpdates: true };
    log = { info: () => {}, debug: () => {}, error: () => {}, warn: () => {} };
    decrypt(value: string): string {
        return value;
    }
    getDevicesAsync(): Promise<ioBroker.DeviceObject[]> {
        return Promise.resolve([]);
    }
}

interface TestAdapter {
    config: { checkForUpdates: boolean };
    minerManager: { init: () => Promise<object>; getMiners: () => object[] };
    createDeviceStateObjects: () => Promise<void>;
    writeStaticInfoStates: () => Promise<void>;
    getStateAsync: (id: string) => Promise<{ val: unknown }>;
    setState: (id: string, state: { val: unknown }) => Promise<void>;
    initDevice: (device: ioBroker.DeviceObject) => Promise<void>;
    checkForUpdates: MinerAdapter['checkForUpdates'];
    updateSources: UpdateSources;
    getDevicesAsync: () => Promise<ioBroker.DeviceObject[]>;
    getForeignStateAsync: (id: string) => Promise<{ val: unknown } | null>;
    deviceManagement: {
        getUpdateInfoItems: (
            id: string,
            installedFeature: MinerFeatureKey,
            features: MinerFeatureKey[],
        ) => Promise<Record<string, ConfigItemAny>>;
    };
}

/** Load the real adapter with a controller-free base class. */
function loadTestAdapterFactory(): () => TestAdapter {
    const corePath = require.resolve('@iobroker/adapter-core');
    const mainPath = require.resolve('./main');
    const savedCore = require.cache[corePath];
    const savedMain = require.cache[mainPath];
    require.cache[corePath] = {
        id: corePath,
        filename: corePath,
        loaded: true,
        exports: {
            Adapter: AdapterMock,
            I18n: { init: () => Promise.resolve(), getTranslatedObject: (key: string) => ({ en: key }) },
        },
    } as NodeModule;
    delete require.cache[mainPath];
    try {
        const load = createRequire(__filename);
        return load('./main') as () => TestAdapter;
    } finally {
        if (savedCore) {
            require.cache[corePath] = savedCore;
        } else {
            delete require.cache[corePath];
        }
        if (savedMain) {
            require.cache[mainPath] = savedMain;
        } else {
            delete require.cache[mainPath];
        }
    }
}

let testAdapterFactory: () => TestAdapter;

before(function () {
    // Cold TypeScript compilation (plus coverage instrumentation) can exceed Mocha's 2s test timeout on CI.
    this.timeout(30_000);
    testAdapterFactory = loadTestAdapterFactory();
});

/** Create an isolated adapter without replacing the timers used by other unit tests. */
function createTestAdapter(): TestAdapter {
    try {
        return testAdapterFactory();
    } finally {
        resetTimerBackend();
    }
}

describe('initial device update check', () => {
    for (const minerType of ['bos', 'avalonMiner']) {
        it(`checks ${minerType} enabled after an empty daily check without blocking initialization`, async () => {
            const adapter = createTestAdapter();
            const writes = new Map<string, unknown>();
            let finishLookup!: (result: { latestVersion: string; updateAvailable: boolean }) => void;
            let checked = false;
            const miner = {
                settings: { id: 'new-device' },
                getSupportedFeatures: () => [MinerFeatureKey.latestVersion, MinerFeatureKey.updateAvailable],
                getInstalledVersionFeature: () => MinerFeatureKey.firmwareVersion,
                subscribeToStats: () => {},
                subscribeToOnlineStatus: () => {},
                checkForUpdate: () => {
                    checked = true;
                    return new Promise(resolve => {
                        finishLookup = resolve;
                    });
                },
            };
            adapter.minerManager = { init: () => Promise.resolve(miner), getMiners: () => [] };
            adapter.createDeviceStateObjects = () => Promise.resolve();
            adapter.writeStaticInfoStates = () => Promise.resolve();
            adapter.getStateAsync = () => Promise.resolve({ val: true });
            adapter.setState = (id, state) => {
                writes.set(id, state.val);
                return Promise.resolve();
            };
            expect((await adapter.checkForUpdates()).checked).to.equal(0);

            const device = {
                _id: 'miner.0.miner.new-device',
                native: { category: 'miner', settings: { id: 'new-device', minerType, host: 'localhost' } },
            } as unknown as ioBroker.DeviceObject;
            await adapter.initDevice(device);
            await new Promise(resolve => setImmediate(resolve));
            expect(checked).to.equal(true);
            finishLookup({ latestVersion: 'new-build', updateAvailable: true });
            // Let the background check finish writing the states.
            await new Promise(resolve => setImmediate(resolve));
            expect(writes.get('miner.new-device.info.latestVersion')).to.equal('new-build');
            expect(writes.get('miner.new-device.info.updateAvailable')).to.equal(true);

            checked = false;
            adapter.config.checkForUpdates = false;
            await adapter.initDevice(device);
            expect(checked).to.equal(false);
        });
    }
});

describe('offline BOS update check after restart', () => {
    for (const enabled of [true, false]) {
        it(`uses persisted identity for an offline device (enabled=${enabled})`, async () => {
            const adapter = createTestAdapter();
            const bos = new BOS({
                minerType: 'bos',
                id: 'saved-bos',
                host: 'offline',
                port: 50051,
                pollInterval: 1000,
                username: 'root',
                password: '',
            });
            const installed = '2023-05-29-0-1daef48b-23.03.2-plus';
            const latest = '2026-10-19-0-46be68fe-26.10-plus';
            const writes = new Map<string, unknown>();
            adapter.minerManager = { init: () => Promise.resolve(bos), getMiners: () => (enabled ? [bos] : []) };
            adapter.getDevicesAsync = () =>
                Promise.resolve([
                    {
                        _id: 'miner.0.miner.saved-bos',
                        native: { category: 'miner', enabled, settings: bos.settings },
                    } as unknown as ioBroker.DeviceObject,
                ]);
            adapter.getStateAsync = id =>
                Promise.resolve({
                    val: id.endsWith('.raw.stats')
                        ? JSON.stringify({ details: { platform: 7, bosVersion: { current: installed } } })
                        : id.endsWith('.info.online')
                          ? false
                          : installed,
                });
            adapter.setState = (id, state) => {
                writes.set(id, state.val);
                return Promise.resolve();
            };
            adapter.updateSources = new UpdateSources({
                fetch: url => {
                    expect(url).to.equal('https://feeds.braiins-os.com/zynq-bm3-am2/');
                    return Promise.resolve(new Response(`<a href="firmware_${latest}_arm.tar">firmware</a>`));
                },
            });

            const result = await adapter.checkForUpdates();
            expect(result).to.deep.equal({ checked: 1, updatesAvailable: 1, failed: 0 });
            expect(writes.get('miner.saved-bos.info.latestVersion')).to.equal(latest);
            expect(writes.get('miner.saved-bos.info.updateAvailable')).to.equal(true);
        });
    }
});

describe('device manager latest version', () => {
    it('shows Unknown for an unavailable version instead of null or a stale update', async () => {
        const adapter = createTestAdapter();
        for (const value of [null, undefined, '']) {
            adapter.getForeignStateAsync = () => Promise.resolve({ val: value });
            const items = await adapter.deviceManagement.getUpdateInfoItems(
                'miner.0.miner.test',
                MinerFeatureKey.firmwareVersion,
                [],
            );
            expect(items.latestVersion.type).to.equal('staticInfo');
            expect(items.latestVersion.data).to.deep.equal({ en: 'Unknown' });
            expect(items.updateStatus.data).to.deep.equal({ en: 'Unknown' });
        }
    });

    it('keeps a known latest version bound to its state', async () => {
        const adapter = createTestAdapter();
        adapter.getForeignStateAsync = () => Promise.resolve({ val: '26.10' });
        const items = await adapter.deviceManagement.getUpdateInfoItems(
            'miner.0.miner.test',
            MinerFeatureKey.firmwareVersion,
            [],
        );
        expect(items.latestVersion.type).to.equal('state');
        expect(Reflect.get(items.latestVersion, 'oid')).to.equal('miner.0.miner.test.info.latestVersion');
    });
});

/** The adapter parts the custom feature handling uses. */
interface CustomFeatureTestAdapter {
    namespace: string;
    log: { info: (msg: string) => void; warn: (msg: string) => void };
    minerManager: { getMiner: (id: string) => object | undefined };
    extendObject: (id: string, obj: { type: string; common: Partial<ioBroker.StateCommon> }) => Promise<void>;
    getObjectAsync: (id: string) => Promise<object | null>;
    getForeignObjectsAsync: (pattern: string) => Promise<Record<string, object>>;
    delObjectAsync: (id: string) => Promise<void>;
    getStateAsync: (id: string) => Promise<{ val: unknown } | null>;
    setState: (id: string, state: { val: unknown; ack: boolean }) => Promise<void>;
    createCustomStateObjects: (
        deviceId: string,
        channels: CustomChannelDefinition[],
        dynamicChannels?: DynamicCustomChannelDefinition[],
    ) => Promise<void>;
    createNewCustomChannels: (deviceId: string, channels: CustomChannelDefinition[]) => Promise<void>;
    onStateChange: (id: string, state: { val: unknown; ack: boolean }) => Promise<void>;
    deviceManagement: {
        getControls: (deviceId: string, miner: object, features: MinerFeatureKey[]) => Promise<DeviceControl<string>[]>;
    };
}

describe('custom features', () => {
    const avalon = new AvalonMiner({
        minerType: 'avalonMiner',
        id: 'dev',
        host: 'localhost',
        port: 4028,
        pollInterval: 1000,
    });

    it('creates one sub-channel per custom channel under custom and removes what is no longer declared', async () => {
        const adapter = createTestAdapter() as unknown as CustomFeatureTestAdapter;
        const created = new Map<string, { type: string; common: Partial<ioBroker.StateCommon> }>();
        const deleted: string[] = [];
        adapter.namespace = 'miner.0';
        adapter.extendObject = (id, obj) => {
            created.set(id, obj);
            return Promise.resolve();
        };
        adapter.getObjectAsync = () => Promise.resolve({});
        adapter.getForeignObjectsAsync = pattern => {
            expect(pattern).to.equal('miner.0.miner.dev.custom.*');
            return Promise.resolve({
                'miner.0.miner.dev.custom.light': {},
                'miner.0.miner.dev.custom.light.on': {},
                'miner.0.miner.dev.custom.old': {},
                'miner.0.miner.dev.custom.old.feature': {},
            });
        };
        adapter.delObjectAsync = id => {
            deleted.push(id);
            return Promise.resolve();
        };

        await adapter.createCustomStateObjects('miner.dev', avalon.getCustomChannels());

        expect(created.get('miner.dev.custom')?.type).to.equal('channel');
        expect(created.get('miner.dev.custom.light')?.type).to.equal('channel');
        expect(created.get('miner.dev.custom.lcd')?.type).to.equal('channel');
        expect(created.get('miner.dev.custom.light.brightness')?.common).to.include({
            type: 'number',
            role: 'level.dimmer',
            min: 0,
            max: 100,
            write: true,
        });
        expect(created.get('miner.dev.custom.light.effect')?.common.states).to.deep.equal({
            1: 'Static',
            2: 'Flash',
            3: 'Breath',
            4: 'Loop',
        });
        // nothing directly under the device root
        expect([...created.keys()].every(id => id.startsWith('miner.dev.custom'))).to.equal(true);
        // states before their channel
        expect(deleted).to.deep.equal(['miner.dev.custom.old.feature', 'miner.dev.custom.old']);

        // a miner without custom features: the whole custom channel goes
        deleted.length = 0;
        created.clear();
        await adapter.createCustomStateObjects('miner.dev', []);
        expect(created.size).to.equal(0);
        expect(deleted).to.deep.equal([
            'miner.dev.custom.old.feature',
            'miner.dev.custom.light.on',
            'miner.dev.custom.light',
            'miner.dev.custom.old',
            'miner.dev.custom',
        ]);
    });

    it('keeps the objects of dynamic channels before the first poll and creates new ones when a poll reports them', async () => {
        const adapter = createTestAdapter() as unknown as CustomFeatureTestAdapter;
        const created: string[] = [];
        const deleted: string[] = [];
        adapter.namespace = 'miner.0';
        adapter.extendObject = id => {
            created.push(id);
            return Promise.resolve();
        };
        adapter.getObjectAsync = () => Promise.resolve({});
        adapter.getForeignObjectsAsync = () =>
            Promise.resolve({
                // from an earlier run: may carry e.g. history settings
                'miner.0.miner.dev.custom.hashboard1': {},
                'miner.0.miner.dev.custom.hashboard1.highestChipTemp': {},
                // a feature the template no longer has
                'miner.0.miner.dev.custom.hashboard1.removed': {},
                'miner.0.miner.dev.custom.old': {},
            });
        adapter.delObjectAsync = id => {
            deleted.push(id);
            return Promise.resolve();
        };
        const bos = new BOS({
            minerType: 'bos',
            id: 'dev',
            host: 'localhost',
            port: 50051,
            username: 'root',
            password: 'root',
            pollInterval: 1000,
        });

        await adapter.createCustomStateObjects('miner.dev', bos.getCustomChannels(), bos.getDynamicCustomChannels());

        expect(created).to.deep.equal(['miner.dev.custom']);
        expect(deleted).to.deep.equal(['miner.dev.custom.hashboard1.removed', 'miner.dev.custom.old']);

        // the first poll reports two boards
        created.length = 0;
        const [template] = bos.getDynamicCustomChannels();
        const boards = ['1', '2'].map(id => ({ ...template, id: `hashboard${id}`, label: `Hashboard ${id}` }));
        await adapter.createNewCustomChannels('miner.dev', boards);

        expect(created).to.include.members([
            'miner.dev.custom.hashboard1',
            'miner.dev.custom.hashboard1.highestChipTemp',
            'miner.dev.custom.hashboard2',
            'miner.dev.custom.hashboard2.chipsCount',
        ]);
        expect(created).to.have.length(2 * (template.features.length + 1));

        // later polls: nothing to create
        created.length = 0;
        await adapter.createNewCustomChannels('miner.dev', boards);
        expect(created).to.deep.equal([]);
    });

    /**
     * An adapter whose only device is a running miner with the given custom feature setter.
     *
     * @param setCustomFeature - the miner's custom feature setter
     */
    function adapterWithMiner(setCustomFeature: (id: string, value: unknown) => Promise<unknown>): {
        adapter: CustomFeatureTestAdapter;
        writes: { id: string; val: unknown; ack: boolean }[];
        warnings: string[];
    } {
        const adapter = createTestAdapter() as unknown as CustomFeatureTestAdapter;
        const writes: { id: string; val: unknown; ack: boolean }[] = [];
        const warnings: string[] = [];
        adapter.log = { info: () => {}, warn: msg => warnings.push(msg) };
        adapter.getObjectAsync = () =>
            Promise.resolve({
                native: { category: 'miner', name: 'Nano', settings: { id: 'dev', minerType: 'avalonMiner' } },
            });
        adapter.getStateAsync = () => Promise.resolve({ val: true });
        adapter.setState = (id, state) => {
            writes.push({ id, ...state });
            return Promise.resolve();
        };
        adapter.minerManager = { getMiner: id => (id === 'dev' ? { setCustomFeature } : undefined) };
        return { adapter, writes, warnings };
    }

    it('sends a written custom state to the miner and acknowledges the value it took', async () => {
        const sent: [string, unknown][] = [];
        const { adapter, writes } = adapterWithMiner((id, value) => {
            sent.push([id, value]);
            return Promise.resolve(Number(value));
        });

        await adapter.onStateChange('miner.0.miner.dev.custom.light.brightness', { val: '40', ack: false });

        expect(sent).to.deep.equal([['light.brightness', '40']]);
        expect(writes).to.deep.equal([{ id: 'miner.0.miner.dev.custom.light.brightness', val: 40, ack: true }]);
    });

    it('leaves the state unacknowledged and warns when the miner rejects it', async () => {
        const { adapter, writes, warnings } = adapterWithMiner(() => Promise.reject(new Error('Invalid ascset')));

        await adapter.onStateChange('miner.0.miner.dev.custom.lcd.on', { val: true, ack: false });

        expect(writes).to.deep.equal([]);
        expect(warnings.join()).to.contain('Invalid ascset');
    });

    it('offers the writable custom features as device manager controls, grouped per channel', async () => {
        const adapter = createTestAdapter() as unknown as CustomFeatureTestAdapter & {
            getForeignStateAsync: (id: string) => Promise<{ val: unknown; ts: number } | null>;
        };
        adapter.getForeignStateAsync = id =>
            Promise.resolve(id.endsWith('.custom.light.brightness') ? { val: 40, ts: 1 } : null);
        const controls = await adapter.deviceManagement.getControls(
            'miner.0.miner.dev',
            avalon,
            avalon.getSupportedFeatures(),
        );

        expect(controls.map(c => [c.id, c.type])).to.deep.equal([
            ['control.profile', 'select'],
            ['custom.light', 'header'],
            ['custom.light.on', 'switch'],
            ['custom.light.effect', 'select'],
            ['custom.light.brightness', 'slider'],
            ['custom.light.colorTemperature', 'slider'],
            ['custom.light.color', 'color'],
            ['custom.lcd', 'header'],
            ['custom.lcd.on', 'switch'],
            // read-only filter.runtime / filter.cleanDue are card rows, not controls
            ['custom.filter', 'header'],
            ['custom.filter.reset', 'button'],
        ]);
        const brightness = controls.find(c => c.id === 'custom.light.brightness');
        expect(brightness?.stateId).to.equal('miner.0.miner.dev.custom.light.brightness');
        expect(brightness?.handler).to.be.a('function');
        // the GUI takes the value from getStateHandler on each change, and the initial one from state
        expect(brightness?.getStateHandler).to.be.a('function');
        expect(brightness?.state?.val).to.equal(40);
        expect(controls.find(c => c.id === 'custom.light.effect')?.options?.[0]).to.deep.equal({
            label: 'Static',
            value: 1,
        });
    });

    it('presses a button feature by writing true, as a button press carries no value', async () => {
        const adapter = createTestAdapter() as unknown as CustomFeatureTestAdapter & {
            getForeignStateAsync: () => Promise<null>;
            setForeignStateAsync: (id: string, state: { val: unknown; ack: boolean }) => Promise<void>;
        };
        const written: { id: string; val: unknown; ack: boolean }[] = [];
        adapter.getForeignStateAsync = () => Promise.resolve(null);
        adapter.setForeignStateAsync = (id, state) => {
            written.push({ id, ...state });
            return Promise.resolve();
        };
        const controls = await adapter.deviceManagement.getControls(
            'miner.0.miner.dev',
            avalon,
            avalon.getSupportedFeatures(),
        );
        const reset = controls.find(c => c.id === 'custom.filter.reset');

        await (reset?.handler as (deviceId: string, controlId: string, state: unknown) => Promise<unknown>)(
            'miner.0.miner.dev',
            'custom.filter.reset',
            null,
        );

        expect(written).to.deep.equal([{ id: 'miner.0.miner.dev.custom.filter.reset', val: true, ack: false }]);
    });
});

describe('state subscriptions', () => {
    it('subscribes to every writable state the adapter handles, custom features included', async () => {
        const adapter = createTestAdapter() as unknown as {
            config: { checkForUpdates: boolean };
            extendObject: () => Promise<void>;
            setState: () => Promise<void>;
            setObjectNotExistsAsync: () => Promise<void>;
            subscribeStates: (pattern: string) => void;
            onReady: () => Promise<void>;
        };
        const patterns: string[] = [];
        adapter.config.checkForUpdates = false;
        adapter.extendObject = () => Promise.resolve();
        adapter.setState = () => Promise.resolve();
        adapter.setObjectNotExistsAsync = () => Promise.resolve();
        adapter.subscribeStates = pattern => patterns.push(pattern);

        await adapter.onReady();

        const subscribed = (id: string): boolean =>
            patterns.some(p => new RegExp(`^${p.replace(/\./g, '\\.').replace(/\*/g, '.*')}$`).test(id));
        for (const id of [
            'miner.dev.enabled',
            'miner.dev.control.profile',
            'miner.dev.custom.light.brightness',
            'miner.dev.custom.lcd.on',
        ]) {
            expect(subscribed(id), id).to.equal(true);
        }
    });
});

describe('profile read-back', () => {
    it('reflects the profile the miner reports in control.profile, only on change', async () => {
        const adapter = createTestAdapter() as unknown as {
            setState: () => Promise<void>;
            setStateChangedAsync: (id: string, state: { val: unknown; ack: boolean }) => Promise<void>;
            processNewStats: (miner: object, settings: object, stats: object) => Promise<void>;
        };
        const changed: { id: string; val: unknown; ack: boolean }[] = [];
        adapter.setState = () => Promise.resolve();
        adapter.setStateChangedAsync = (id, state) => {
            changed.push({ id, ...state });
            return Promise.resolve();
        };
        const miner = { getSupportedFeatures: () => [MinerFeatureKey.profile], getCustomChannels: () => [] };
        const settings = { category: 'miner', name: 'Nano', settings: { id: 'dev' } };

        await adapter.processNewStats(miner, settings, { profile: 'high' });
        await adapter.processNewStats(miner, settings, {});

        expect(changed.filter(c => c.id.endsWith('.profile'))).to.deep.equal([
            { id: 'miner.dev.control.profile', val: 'high', ack: true },
        ]);
    });
});

describe('custom feature notifications', () => {
    it('raises the notification once when a feature with one turns true', async () => {
        const adapter = createTestAdapter() as unknown as {
            log: { warn: (msg: string) => void; debug: () => void };
            setState: () => Promise<void>;
            getStateAsync: (id: string) => Promise<{ val: unknown } | null>;
            setStateChangedAsync: (id: string, state: { val: unknown; ack: boolean }) => Promise<void>;
            registerNotification: (scope: string, category: string, message: string) => Promise<void>;
            extendObject: () => Promise<void>;
            processNewStats: (miner: object, settings: object, stats: object) => Promise<void>;
        };
        const stored = new Map<string, unknown>();
        // processNewStats creates the objects of custom channels it sees for the first time
        adapter.extendObject = () => Promise.resolve();
        const notifications: [string, string, string][] = [];
        adapter.log = { warn: () => {}, debug: () => {} };
        adapter.setState = () => Promise.resolve();
        adapter.getStateAsync = id => Promise.resolve(stored.has(id) ? { val: stored.get(id) } : null);
        adapter.setStateChangedAsync = (id, state) => {
            stored.set(id, state.val);
            return Promise.resolve();
        };
        adapter.registerNotification = (scope, category, message) => {
            notifications.push([scope, category, message]);
            return Promise.resolve();
        };
        const miner = new AvalonMiner({
            minerType: 'avalonMiner',
            id: 'dev',
            host: 'localhost',
            port: 4028,
            pollInterval: 1000,
        });
        const settings = { category: 'miner', name: 'Nano', settings: { id: 'dev' } };

        await adapter.processNewStats(miner, settings, { custom: { 'filter.cleanDue': false } });
        await adapter.processNewStats(miner, settings, { custom: { 'filter.cleanDue': true } });
        await adapter.processNewStats(miner, settings, { custom: { 'filter.cleanDue': true } });

        expect(notifications).to.have.length(1);
        expect(notifications[0][0]).to.equal('miner');
        expect(notifications[0][1]).to.equal('filterClean');
        expect(notifications[0][2]).to.match(/^Miner "Nano": The dust filter should be cleaned/);

        // cleaned and reset, due again later: notified again
        await adapter.processNewStats(miner, settings, { custom: { 'filter.cleanDue': false } });
        await adapter.processNewStats(miner, settings, { custom: { 'filter.cleanDue': true } });
        expect(notifications).to.have.length(2);
    });
});

describe('pool devices', () => {
    interface PoolTestAdapter {
        poolManager: {
            init: (settings: object) => Promise<object>;
            hasPool: (id: string) => boolean;
            close: (id: string) => Promise<void>;
        };
        extendObject: (id: string, obj: { type?: string; common?: object }) => Promise<void>;
        setState: (id: string, state: { val: unknown }) => Promise<void>;
        setStateChangedAsync: (id: string, state: { val: unknown }) => Promise<void>;
        getStateAsync: (id: string) => Promise<{ val: unknown } | null>;
        getObjectAsync: (id: string) => Promise<object | null>;
        getForeignObjectsAsync: (pattern: string, type?: string) => Promise<Record<string, object>>;
        delObjectAsync: (id: string, options?: { recursive?: boolean }) => Promise<void>;
        namespace: string;
        initDevice: (device: ioBroker.DeviceObject) => Promise<void>;
        onStateChange: (id: string, state: { val: unknown; ack: boolean }) => Promise<void>;
    }

    const device = {
        _id: 'miner.0.pool.my-pool',
        common: { name: 'my pool' },
        native: {
            category: 'pool',
            name: 'my pool',
            settings: { poolType: 'braiinsPool', id: 'my-pool', pollInterval: 60_000, apiToken: 'token' },
        },
    } as unknown as ioBroker.DeviceObject;

    function createPoolTestAdapter(): {
        adapter: PoolTestAdapter;
        objects: Map<string, { type?: string; common?: object }>;
        writes: Map<string, unknown>;
        extendCalls: string[];
        publish: () => { stats?: (stats: PoolStats) => Promise<void>; online?: (online: boolean) => Promise<void> };
        active: Set<string>;
        inits: () => number;
    } {
        const adapter = createTestAdapter() as unknown as PoolTestAdapter;
        const objects = new Map<string, { type?: string; common?: object }>();
        const writes = new Map<string, unknown>();
        const extendCalls: string[] = [];
        const active = new Set<string>();
        const callbacks: {
            stats?: (stats: PoolStats) => Promise<void>;
            online?: (online: boolean) => Promise<void>;
        } = {};
        const pool = {
            getSupportedFeatures: () => Object.values(PoolFeatureKey),
            subscribeToStats: (cb: (stats: PoolStats) => Promise<void>) => (callbacks.stats = cb),
            subscribeToOnlineStatus: (cb: (online: boolean) => Promise<void>) => (callbacks.online = cb),
        };
        let inits = 0;
        adapter.namespace = 'miner.0';
        adapter.poolManager = {
            init: settings => {
                inits++;
                active.add((settings as { id: string }).id);
                return Promise.resolve(pool);
            },
            hasPool: id => active.has(id),
            close: id => {
                active.delete(id);
                return Promise.resolve();
            },
        };
        adapter.extendObject = (id, obj) => {
            extendCalls.push(id);
            objects.set(id, obj);
            return Promise.resolve();
        };
        adapter.setState = (id, state) => {
            writes.set(id, state.val);
            return Promise.resolve();
        };
        adapter.setStateChangedAsync = adapter.setState;
        adapter.getStateAsync = id => Promise.resolve(writes.has(id) ? { val: writes.get(id) } : null);
        adapter.getObjectAsync = id => Promise.resolve(id === device._id ? device : null);
        adapter.getForeignObjectsAsync = (pattern, type) => {
            expect(pattern.endsWith('.*')).to.equal(true);
            expect(type).to.equal('channel');
            const prefix = pattern.slice('miner.0.'.length, -1);
            return Promise.resolve(
                Object.fromEntries(
                    [...objects.entries()]
                        .filter(([id, obj]) => id.startsWith(prefix) && obj.type === type)
                        .map(([id, obj]) => [`miner.0.${id}`, obj]),
                ),
            );
        };
        adapter.delObjectAsync = (id, options) => {
            expect(options?.recursive).to.equal(true);
            for (const existing of [...objects.keys()]) {
                if (existing === id || existing.startsWith(`${id}.`)) {
                    objects.delete(existing);
                }
            }
            return Promise.resolve();
        };
        return { adapter, objects, writes, extendCalls, publish: () => callbacks, active, inits: () => inits };
    }

    it('creates the pool states, polls the pool and writes stats and workers', async () => {
        const { adapter, objects, writes, extendCalls, publish, active } = createPoolTestAdapter();

        await adapter.initDevice(device);

        expect(active.has('my-pool')).to.equal(true);
        expect(objects.get('pool.my-pool.stats.hashrate5m')?.common).to.include({ unit: 'H/s' });
        expect(objects.get('pool.my-pool.rewards.currentBalance')?.common).to.include({ unit: 'BTC' });
        expect(writes.get('pool.my-pool.info.poolType')).to.equal('braiinsPool');
        expect(writes.get('pool.my-pool.enabled')).to.equal(true);
        expect(writes.get('pool.my-pool.info.online')).to.equal(false);

        const stats: PoolStats = {
            username: 'me',
            hashrate5m: 1e12,
            currentBalance: 0.01,
            workers: [{ name: 'me.rig1', state: 'ok', hashrate5m: 5e11 }],
        };
        await publish().stats?.(stats);
        await publish().stats?.(stats);

        expect(writes.get('pool.my-pool.stats.hashrate5m')).to.equal(1e12);
        expect(writes.get('pool.my-pool.rewards.currentBalance')).to.equal(0.01);
        expect(writes.get('pool.my-pool.info.username')).to.equal('me');
        expect(writes.get('pool.my-pool.info.online')).to.equal(true);
        expect(writes.get('pool.my-pool.workers.rig1.state')).to.equal('ok');
        expect(writes.get('pool.my-pool.workers.rig1.hashrate5m')).to.equal(5e11);
        expect(objects.get('pool.my-pool.workers.rig1')).to.deep.equal({
            type: 'channel',
            common: { name: 'me.rig1' },
        });
        // the worker channel is created on the first poll only
        expect(extendCalls.filter(id => id === 'pool.my-pool.workers.rig1')).to.have.length(1);
    });

    it('stops and restarts polling via the enabled state', async () => {
        const { adapter, writes, active } = createPoolTestAdapter();
        await adapter.initDevice(device);
        expect(active.has('my-pool')).to.equal(true);

        // the controller stores the written value before it emits the change
        writes.set('miner.0.pool.my-pool.enabled', false);
        await adapter.onStateChange('miner.0.pool.my-pool.enabled', { val: false, ack: false });
        expect(active.has('my-pool')).to.equal(false);
        expect(writes.get('pool.my-pool.info.online')).to.equal(false);

        writes.set('miner.0.pool.my-pool.enabled', true);
        await adapter.onStateChange('miner.0.pool.my-pool.enabled', { val: true, ack: false });
        expect(active.has('my-pool')).to.equal(true);
    });

    it('removes the channel of a worker the pool no longer reports, also one left from an earlier run', async () => {
        const { adapter, objects, publish } = createPoolTestAdapter();
        objects.set('pool.my-pool.workers.old', { type: 'channel' });
        objects.set('pool.my-pool.workers.old.state', { type: 'state' });
        await adapter.initDevice(device);

        await publish().stats?.({ username: 'me', workers: [{ name: 'me.rig1' }, { name: 'me.rig2' }] });
        expect(objects.has('pool.my-pool.workers.old')).to.equal(false);
        expect(objects.has('pool.my-pool.workers.old.state')).to.equal(false);
        expect(objects.has('pool.my-pool.workers.rig1.state')).to.equal(true);
        expect(objects.has('pool.my-pool.workers.rig2.state')).to.equal(true);

        await publish().stats?.({ username: 'me', workers: [{ name: 'me.rig2' }] });
        expect(objects.has('pool.my-pool.workers.rig1')).to.equal(false);
        expect(objects.has('pool.my-pool.workers.rig1.state')).to.equal(false);
        expect(objects.has('pool.my-pool.workers.rig2.state')).to.equal(true);

        // a worker that comes back gets its channel again
        await publish().stats?.({ username: 'me', workers: [{ name: 'me.rig1' }, { name: 'me.rig2' }] });
        expect(objects.has('pool.my-pool.workers.rig1.state')).to.equal(true);
    });

    it('keeps the worker channels when the pool did not report its workers', async () => {
        const { adapter, objects, publish } = createPoolTestAdapter();
        await adapter.initDevice(device);

        await publish().stats?.({ username: 'me', workers: [{ name: 'me.rig1' }] });
        await publish().stats?.({ username: 'me' });

        expect(objects.has('pool.my-pool.workers.rig1.state')).to.equal(true);
    });

    it('keeps workers apart whose names differ only in characters not allowed in object ids', async () => {
        const { adapter, objects, writes, publish } = createPoolTestAdapter();
        await adapter.initDevice(device);

        await publish().stats?.({
            username: 'me',
            workers: [
                { name: 'me.rig.1', hashrate5m: 1 },
                { name: 'me.rig_1', hashrate5m: 2 },
            ],
        });

        const channels = [...objects.entries()].filter(
            ([id, obj]) => id.startsWith('pool.my-pool.workers.') && obj.type === 'channel',
        );
        expect(channels.map(([, obj]) => (obj.common as { name: string }).name).sort()).to.deep.equal([
            'me.rig.1',
            'me.rig_1',
        ]);
        expect(writes.get('pool.my-pool.workers.rig_1.hashrate5m')).to.equal(2);
    });

    it('initializes the pool once when two enable requests arrive together', async () => {
        const { adapter, writes, active, inits } = createPoolTestAdapter();
        writes.set('miner.0.pool.my-pool.enabled', false);
        await adapter.initDevice(device);
        expect(inits()).to.equal(0);

        writes.set('miner.0.pool.my-pool.enabled', true);
        await Promise.all([
            adapter.onStateChange('miner.0.pool.my-pool.enabled', { val: true, ack: false }),
            adapter.onStateChange('miner.0.pool.my-pool.enabled', { val: true, ack: false }),
        ]);

        expect(inits()).to.equal(1);
        expect(active.has('my-pool')).to.equal(true);
    });

    for (const enabledInSettings of [undefined, false]) {
        it(`closes an active pool on delete without logging an error (settings.enabled=${enabledInSettings})`, async () => {
            const { adapter, active } = createPoolTestAdapter();
            const errors: string[] = [];
            const deleting = adapter as unknown as {
                log: { error: (message: string) => void };
                delDevice: (id: string) => Promise<boolean>;
                tryCloseDevice: (settings: object) => Promise<boolean>;
            };
            deleting.log.error = message => void errors.push(message);
            await adapter.initDevice(device);
            expect(active.has('my-pool')).to.equal(true);

            // delDevice passes the settings of the device object, which don't hold `enabled`;
            // updateDevice the ones of the form, which may already say disabled
            if (enabledInSettings === undefined) {
                expect(await deleting.delDevice(device._id)).to.equal(true);
            } else {
                expect(await deleting.tryCloseDevice({ ...device.native, enabled: enabledInSettings })).to.equal(true);
            }

            expect(active.has('my-pool')).to.equal(false);
            expect(errors).to.deep.equal([]);
        });
    }

    it('does not poll a disabled pool', async () => {
        const { adapter, writes, active } = createPoolTestAdapter();
        writes.set('miner.0.pool.my-pool.enabled', false);

        await adapter.initDevice(device);

        expect(active.has('my-pool')).to.equal(false);
        expect(writes.get('pool.my-pool.enabled')).to.equal(false);
    });
});
