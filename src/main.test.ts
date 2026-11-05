import { expect } from 'chai';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
import { resetTimerBackend } from './lib/utils/delay';
import { MinerFeatureKey } from './lib/miner/model/MinerFeature';
import type { MinerAdapter } from './main';
import type { ConfigItemAny } from '@iobroker/dm-utils';
import { BOS } from './lib/miner/miner/BOS';
import { UpdateSources } from './lib/update/UpdateSources';
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
        exports: { Adapter: AdapterMock, I18n: { getTranslatedObject: (key: string) => ({ en: key }) } },
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
        adapter.poolManager = {
            init: settings => {
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
        return { adapter, objects, writes, extendCalls, publish: () => callbacks, active };
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

    it('does not poll a disabled pool', async () => {
        const { adapter, writes, active } = createPoolTestAdapter();
        writes.set('miner.0.pool.my-pool.enabled', false);

        await adapter.initDevice(device);

        expect(active.has('my-pool')).to.equal(false);
        expect(writes.get('pool.my-pool.enabled')).to.equal(false);
    });
});
