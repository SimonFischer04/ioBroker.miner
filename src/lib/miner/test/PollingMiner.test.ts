import { PollingMiner } from '../miner/PollingMiner';
import { expect } from 'chai';
import type { PollingMinerSettings } from '../model/MinerSettings';
import type { MinerFeatureKey } from '../model/MinerFeature';
import type { MinerStats } from '../model/MinerStats';
import { setTimerBackend, type TimerBackend } from '../../utils/delay';

class TestPollingMiner extends PollingMiner<PollingMinerSettings> {
    public fetchStatsStub: () => Promise<MinerStats> = () => Promise.resolve({} as MinerStats);

    constructor(pollInterval: number) {
        super({
            minerType: 'test',
            host: 'localhost',
            pollInterval,
        });
    }

    public async fetchStats(): Promise<MinerStats> {
        return this.fetchStatsStub();
    }

    public getSupportedFeatures(): MinerFeatureKey[] {
        return [];
    }

    public start(): Promise<void> {
        return Promise.resolve();
    }

    public stop(): Promise<void> {
        return Promise.resolve();
    }

    public getCliArgs(): string[] {
        return [];
    }
}

describe('PollingMiner exponential backoff', () => {
    const scheduledDelays: number[] = [];
    let pollCount: number;
    let maxPolls: number;
    let resolveDone: (() => void) | undefined;

    /**
     * Fake timer backend that executes scheduled callbacks synchronously (via microtask)
     * and records the timeout values passed to `schedule`.
     */
    const fakeBackend: TimerBackend = {
        schedule: (cb, ms) => {
            scheduledDelays.push(ms);
            pollCount++;
            if (pollCount >= maxPolls) {
                if (resolveDone) {
                    resolveDone();
                }
                // Return a dummy handle; don't invoke cb so loop stops
                return 'stopped';
            }
            // Execute cb on next microtask to allow async flow
            const p = Promise.resolve().then(cb);
            return p;
        },
        clear: () => {
            /* no-op for tests */
        },
        scheduleInterval: (cb, interval) => setInterval(cb, interval),
        clearInterval: timer => clearInterval(timer as ReturnType<typeof setInterval>),
        delay: ms => new Promise(resolve => setTimeout(resolve, ms)),
    };

    beforeEach(() => {
        scheduledDelays.length = 0;
        pollCount = 0;
        maxPolls = 6;
        resolveDone = undefined;
        setTimerBackend(fakeBackend);
    });

    afterEach(() => {
        setTimerBackend({
            schedule: (cb, timeout) => setTimeout(cb, timeout),
            clear: timer => clearTimeout(timer as ReturnType<typeof setTimeout>),
            scheduleInterval: (cb, interval) => setInterval(cb, interval),
            clearInterval: timer => clearInterval(timer as ReturnType<typeof setInterval>),
            delay: ms => new Promise(resolve => setTimeout(resolve, ms)),
        });
    });

    it('uses base interval on success', async () => {
        const miner = new TestPollingMiner(1000);
        miner.fetchStatsStub = () => Promise.resolve({} as MinerStats);

        const done = new Promise<void>(resolve => {
            resolveDone = resolve;
        });

        await miner.init();
        await done;
        await miner.close();

        // All scheduled delays should be the base interval (1000ms) since no failures
        for (const d of scheduledDelays) {
            expect(d).to.equal(1000);
        }
    });

    it('increases delay exponentially on consecutive failures', async () => {
        const miner = new TestPollingMiner(1000);
        miner.fetchStatsStub = () => Promise.reject(new Error('connection failed'));

        const done = new Promise<void>(resolve => {
            resolveDone = resolve;
        });

        await miner.init();
        await done;
        await miner.close();

        // Consecutive failures: 2000, 4000, 8000, 16000, 32000, 32000 (capped)
        expect(scheduledDelays[0]).to.equal(2000); // 1000 * 2^1
        expect(scheduledDelays[1]).to.equal(4000); // 1000 * 2^2
        expect(scheduledDelays[2]).to.equal(8000); // 1000 * 2^3
        expect(scheduledDelays[3]).to.equal(16000); // 1000 * 2^4
        expect(scheduledDelays[4]).to.equal(32000); // 1000 * 2^5 (max)
        expect(scheduledDelays[5]).to.equal(32000); // stays at max
    });

    it('resets delay after successful poll', async () => {
        maxPolls = 6;
        const miner = new TestPollingMiner(1000);
        let callCount = 0;
        miner.fetchStatsStub = () => {
            callCount++;
            // Fail first 3, then succeed
            if (callCount <= 3) {
                return Promise.reject(new Error('fail'));
            }
            return Promise.resolve({} as MinerStats);
        };

        const done = new Promise<void>(resolve => {
            resolveDone = resolve;
        });

        await miner.init();
        await done;
        await miner.close();

        // First 3 failures: 2000, 4000, 8000
        expect(scheduledDelays[0]).to.equal(2000);
        expect(scheduledDelays[1]).to.equal(4000);
        expect(scheduledDelays[2]).to.equal(8000);
        // After success, reset to base
        expect(scheduledDelays[3]).to.equal(1000);
    });

    it('close() cancels the pending timer immediately', async () => {
        let clearCalled = false;
        const customBackend: TimerBackend = {
            ...fakeBackend,
            schedule: (_cb, ms) => {
                scheduledDelays.push(ms);
                return 'timer-handle';
            },
            clear: () => {
                clearCalled = true;
            },
        };
        setTimerBackend(customBackend);

        const miner = new TestPollingMiner(1000);
        await miner.init();
        await miner.close();

        expect(clearCalled).to.equal(true);
    });

    it('close() stops the loop even while a poll is still in flight', async () => {
        // Manual backend: the test decides when a scheduled callback runs, so the poll can be kept
        // in flight across the close() call.
        let pending: (() => void) | undefined;
        const manualBackend: TimerBackend = {
            ...fakeBackend,
            schedule: (cb, ms) => {
                scheduledDelays.push(ms);
                pending = cb;
                return 'timer-handle';
            },
            clear: () => {
                pending = undefined;
            },
        };
        setTimerBackend(manualBackend);

        const miner = new TestPollingMiner(1000);
        let fetchCount = 0;
        let finishPoll: (() => void) | undefined;
        miner.fetchStatsStub = () => {
            fetchCount++;
            // never resolves until the test says so
            return new Promise<MinerStats>(resolve => {
                finishPoll = () => resolve({});
            });
        };

        // init() polls immediately, so the first fetchStats is now pending
        await miner.init();
        expect(fetchCount).to.equal(1);
        expect(finishPoll).to.not.be.undefined;

        // close() while that poll is still awaited
        await miner.close();

        // let the in-flight poll settle completely (fetchStats -> onStats -> re-arm)
        finishPoll?.();
        await new Promise<void>(resolve => setImmediate(resolve));

        // the resolved poll must not have re-armed the timer
        expect(pending).to.be.undefined;
        expect(fetchCount).to.equal(1);
    });
});
