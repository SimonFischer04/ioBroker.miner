import { expect } from 'chai';
import { Pool } from '../Pool';
import { PoolManager } from '../PoolManager';
import type { PoolSettings } from '../../model/PoolSettings';
import type { PoolStats } from '../../model/PoolStats';
import type { PoolFeatureKey } from '../../model/PoolFeature';
import { Logger } from '../../model/Logger';
import { Level } from '../../model/Level';
import { resetTimerBackend, setTimerBackend, type TimerBackend } from '../../../utils/delay';

class TestPool extends Pool<PoolSettings> {
    public fetchStatsStub: () => Promise<PoolStats> = () => Promise.resolve({});

    constructor(settings: Partial<PoolSettings> = { pollInterval: 60_000 }) {
        super({ poolType: 'braiinsPool', ...settings } as PoolSettings);
    }

    public fetchStats(): Promise<PoolStats> {
        return this.fetchStatsStub();
    }

    public getSupportedFeatures(): PoolFeatureKey[] {
        return [];
    }

    public override getMinPollInterval(): number {
        return 30_000;
    }
}

/**
 * A promise that is settled from outside.
 */
function deferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>(r => {
        resolve = r;
    });
    return { promise, resolve };
}

/**
 * Waits until all pending promise continuations have run.
 */
function settle(): Promise<void> {
    return new Promise(resolve => setImmediate(resolve));
}

describe('Pool', () => {
    let scheduled: { callback: () => void; ms: number }[];

    // timers never fire on their own: the test decides when the next poll runs
    const manualBackend: TimerBackend = {
        schedule: (callback, ms) => {
            const timer = { callback, ms };
            scheduled.push(timer);
            return timer;
        },
        clear: timer => {
            scheduled = scheduled.filter(t => t !== timer);
        },
        scheduleInterval: () => {
            throw new Error('not used by these tests');
        },
        clearInterval: () => {
            throw new Error('not used by these tests');
        },
        delay: () => {
            throw new Error('not used by these tests');
        },
    };

    beforeEach(() => {
        scheduled = [];
        setTimerBackend(manualBackend);
    });

    afterEach(() => {
        resetTimerBackend();
    });

    it('puts no time limit on a poll, which may wait behind the requests of other accounts', async () => {
        const pool = new TestPool();
        const fetching = deferred<PoolStats>();
        const received: PoolStats[] = [];
        pool.fetchStatsStub = () => fetching.promise;
        pool.subscribeToStats(stats => Promise.resolve(void received.push(stats)));

        await pool.init();
        await settle();
        // nothing is scheduled while the poll is waiting: no timeout that could fail it, no next poll
        expect(scheduled).to.deep.equal([]);

        fetching.resolve({ username: 'late' });
        await settle();
        expect(received).to.deep.equal([{ username: 'late' }]);
        expect(scheduled.map(timer => timer.ms)).to.deep.equal([60_000]);

        await pool.close();
    });

    it('waits in close() for statistics that are being published', async () => {
        const pool = new TestPool();
        const writing = deferred<void>();
        let closed = false;
        pool.subscribeToStats(() => writing.promise);

        await pool.init();
        await settle();
        const closing = pool.close().then(() => (closed = true));
        await settle();
        expect(closed).to.equal(false);

        writing.resolve();
        await closing;
        expect(closed).to.equal(true);
    });

    it('does not publish statistics that arrive after close()', async () => {
        const pool = new TestPool();
        const fetching = deferred<PoolStats>();
        let published = 0;
        pool.fetchStatsStub = () => fetching.promise;
        pool.subscribeToStats(() => Promise.resolve(void published++));
        pool.subscribeToOnlineStatus(() => Promise.resolve(void published++));

        await pool.init();
        await settle();
        await pool.close();
        fetching.resolve({});
        await settle();

        expect(published).to.equal(0);
        expect(scheduled).to.deep.equal([]);
    });

    it('warns once about a poll interval below the minimum, also when it is missing', async () => {
        const savedLogger = Logger.logger;
        const warnings: string[] = [];
        Logger.setLogger({
            log: (level, message) => {
                if (level === Level.WARN) {
                    warnings.push(message);
                }
            },
        });
        try {
            for (const settings of [{ pollInterval: 1000 }, {}]) {
                const pool = new TestPool(settings);
                expect(pool.getEffectivePollInterval()).to.equal(30_000);
                expect(pool.getEffectivePollInterval()).to.equal(30_000);
                await pool.init();
                await settle();
                await pool.close();
            }
        } finally {
            Logger.setLogger(savedLogger);
        }

        expect(warnings).to.have.length(2);
        expect(warnings[0]).to.contain('pollInterval 1000 is below the minimum of 30000ms');
        expect(warnings[1]).to.contain('no valid pollInterval configured');
    });

    it('does not warn about a valid poll interval', async () => {
        const savedLogger = Logger.logger;
        const warnings: string[] = [];
        Logger.setLogger({ log: (level, message) => void (level === Level.WARN && warnings.push(message)) });
        try {
            const pool = new TestPool({ pollInterval: 45_000 });
            await pool.init();
            await settle();
            await pool.close();
            expect(pool.getEffectivePollInterval()).to.equal(45_000);
        } finally {
            Logger.setLogger(savedLogger);
        }
        expect(warnings).to.deep.equal([]);
    });
});

describe('PoolManager', () => {
    it('refuses to initialize a pool id twice', async () => {
        const manager = new PoolManager();
        const settings = { poolType: 'braiinsPool', id: 'twice', pollInterval: 60_000, apiToken: 'x' } as PoolSettings;
        // an unreachable API: only the registration matters here
        Object.assign(settings, { baseUrl: 'http://127.0.0.1:9' });

        const first = manager.init(settings);
        const second = manager.init(settings).catch((e: unknown) => e);
        try {
            await first;
            expect(((await second) as Error).message).to.contain('already initialized');
            expect(manager.getPools()).to.have.length(1);
        } finally {
            await manager.closeAll();
        }
        expect(manager.hasPool('twice')).to.equal(false);
    });
});
