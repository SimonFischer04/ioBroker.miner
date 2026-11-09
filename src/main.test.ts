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
import type { CustomChannelDefinition } from './lib/miner/model/CustomFeature';

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
    createCustomStateObjects: (deviceId: string, channels: CustomChannelDefinition[]) => Promise<void>;
    onStateChange: (id: string, state: { val: unknown; ack: boolean }) => Promise<void>;
    deviceManagement: {
        getControls: (deviceId: string, miner: object, features: MinerFeatureKey[]) => DeviceControl<string>[];
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

    it('offers the writable custom features as device manager controls, grouped per channel', () => {
        const adapter = createTestAdapter() as unknown as CustomFeatureTestAdapter;
        const controls = adapter.deviceManagement.getControls(
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
        ]);
        const brightness = controls.find(c => c.id === 'custom.light.brightness');
        expect(brightness?.stateId).to.equal('miner.0.miner.dev.custom.light.brightness');
        expect(brightness?.handler).to.be.a('function');
        expect(controls.find(c => c.id === 'custom.light.effect')?.options?.[0]).to.deep.equal({
            label: 'Static',
            value: 1,
        });
    });
});
