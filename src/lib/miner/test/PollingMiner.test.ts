import { PollingMiner } from '../miner/PollingMiner';
import { expect } from 'chai';
import type { PollingMinerSettings } from '../model/MinerSettings';
import type { MinerFeatureKey } from '../model/MinerFeature';
import type { MinerStats } from '../model/MinerStats';
import { resetTimerBackend, setTimerBackend, type TimerBackend } from '../../utils/delay';

class TestPollingMiner extends PollingMiner<PollingMinerSettings> {
    public fetchStatsStub: () => Promise<MinerStats> = () => Promise.resolve({});

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

/**
 * Waits until all pending promise continuations have run.
 */
function settle(): Promise<void> {
    return new Promise(resolve => setImmediate(resolve));
}

// The backoff policy itself is covered in utils/delay.test.ts - these tests cover how PollingMiner uses it.
describe('PollingMiner', () => {
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

    /**
     * Runs the next scheduled poll and waits for it to settle.
     */
    async function pollAgain(): Promise<void> {
        const timer = scheduled.shift();
        if (!timer) {
            throw new Error('no poll scheduled');
        }
        timer.callback();
        await settle();
    }

    const realRandom = Math.random;

    /**
     * Starts a miner whose polls keep failing and collects the delay scheduled after each of them.
     *
     * @param pollInterval - the miner's pollInterval in ms
     * @param failures - how many failing polls to run
     */
    async function backoffDelays(pollInterval: number, failures: number): Promise<number[]> {
        const miner = new TestPollingMiner(pollInterval);
        miner.fetchStatsStub = () => Promise.reject(new Error('connection refused'));

        await miner.init();
        await settle();
        const delays = [scheduled[0].ms];
        for (let i = 1; i < failures; i++) {
            await pollAgain();
            delays.push(scheduled[0].ms);
        }
        await miner.close();
        return delays;
    }

    beforeEach(() => {
        scheduled = [];
        setTimerBackend(manualBackend);
        // backoff delays are randomized - start from a draw that leaves them untouched
        Math.random = () => 0;
    });

    afterEach(() => {
        resetTimerBackend();
        Math.random = realRandom;
    });

    it('polls immediately on init and then every pollInterval while polls succeed', async () => {
        const miner = new TestPollingMiner(1000);
        let fetchCount = 0;
        miner.fetchStatsStub = () => {
            fetchCount++;
            return Promise.resolve({});
        };

        await miner.init();
        await settle();
        expect(fetchCount).to.equal(1);
        expect(scheduled.map(t => t.ms)).to.deep.equal([1000]);

        await pollAgain();
        expect(fetchCount).to.equal(2);
        expect(scheduled.map(t => t.ms)).to.deep.equal([1000]);

        await miner.close();
    });

    it('publishes the stats of a successful poll to subscribers', async () => {
        const miner = new TestPollingMiner(1000);
        miner.fetchStatsStub = () => Promise.resolve({ power: 1234 });
        const received: MinerStats[] = [];
        miner.subscribeToStats(stats => {
            received.push(stats);
            return Promise.resolve();
        });

        await miner.init();
        await settle();

        expect(received).to.deep.equal([{ power: 1234 }]);
        await miner.close();
    });

    it('backs off while fetchStats fails and returns to pollInterval after a successful poll', async () => {
        const miner = new TestPollingMiner(1000);
        let fetchCount = 0;
        miner.fetchStatsStub = () => {
            fetchCount++;
            // fail the first three polls, then recover
            return fetchCount <= 3 ? Promise.reject(new Error('connection refused')) : Promise.resolve({});
        };

        await miner.init();
        await settle();
        const delays = [scheduled[0].ms];
        for (let i = 0; i < 3; i++) {
            await pollAgain();
            delays.push(scheduled[0].ms);
        }

        // a failing fetchStats has to reach the backoff helper, so PollingMiner must not swallow it
        expect(delays).to.deep.equal([2000, 4000, 8000, 1000]);
        await miner.close();
    });

    it('never waits more than 5 minutes between polls, however long pollInterval is', async () => {
        // with only the 2^5 cap, a 60s interval would back off to 32 minutes
        expect(await backoffDelays(60_000, 5)).to.deep.equal([120_000, 240_000, 300_000, 300_000, 300_000]);
    });

    it('randomly shortens backoff delays by up to 20 %', async () => {
        Math.random = () => 0.5;
        // 0.2 * 0.5 = 10 % shorter
        expect(await backoffDelays(1000, 3)).to.deep.equal([1800, 3600, 7200]);
    });

    describe('online status', () => {
        /**
         * Starts a miner whose polls follow the given outcomes (true = success) and collects the online statuses it reports.
         *
         * @param outcomes - result of each poll, in order
         */
        async function onlineStatuses(outcomes: boolean[]): Promise<boolean[]> {
            const miner = new TestPollingMiner(1000);
            let poll = 0;
            miner.fetchStatsStub = () =>
                outcomes[poll++] ? Promise.resolve({}) : Promise.reject(new Error('connection refused'));
            const statuses: boolean[] = [];
            miner.subscribeToOnlineStatus(online => {
                statuses.push(online);
                return Promise.resolve();
            });

            await miner.init();
            await settle();
            for (let i = 1; i < outcomes.length; i++) {
                await pollAgain();
            }
            await miner.close();
            return statuses;
        }

        it('reports online on the first successful poll, and not again while polls keep succeeding', async () => {
            expect(await onlineStatuses([true, true, true])).to.deep.equal([true]);
        });

        it('reports offline once 3 polls in a row failed, and only once', async () => {
            expect(await onlineStatuses([true, false, false])).to.deep.equal([true]);
            expect(await onlineStatuses([true, false, false, false])).to.deep.equal([true, false]);
            expect(await onlineStatuses([true, false, false, false, false, false])).to.deep.equal([true, false]);
        });

        it('reports a miner that never answered as offline after 3 failed polls', async () => {
            expect(await onlineStatuses([false, false, false])).to.deep.equal([false]);
        });

        it('does not count failures that a successful poll interrupted', async () => {
            expect(await onlineStatuses([true, false, false, true, false, false])).to.deep.equal([true]);
        });

        it('reports online again on the first successful poll after being offline', async () => {
            expect(await onlineStatuses([true, false, false, false, true, true])).to.deep.equal([true, false, true]);
        });

        it('stops reporting after close()', async () => {
            const miner = new TestPollingMiner(1000);
            miner.fetchStatsStub = () => Promise.reject(new Error('connection refused'));
            const statuses: boolean[] = [];
            miner.subscribeToOnlineStatus(online => {
                statuses.push(online);
                return Promise.resolve();
            });

            await miner.init();
            await settle();
            await pollAgain();
            const thirdPoll = scheduled[0];
            await miner.close();
            // a poll that was already due when close() ran
            thirdPoll.callback();
            await settle();

            expect(statuses).to.deep.equal([]);
        });
    });

    describe('poll timeout', () => {
        it('counts a poll that hangs as failed once its pollInterval has passed', async () => {
            const miner = new TestPollingMiner(60_000);
            // never settles
            miner.fetchStatsStub = () => new Promise<MinerStats>(() => {});

            await miner.init();
            await settle();
            // only the timeout of the hanging poll is pending
            expect(scheduled.map(t => t.ms)).to.deep.equal([60_000]);

            await pollAgain();

            // the timeout went through the backoff like any other failure
            expect(scheduled.map(t => t.ms)).to.deep.equal([120_000]);
            await miner.close();
        });

        it('allows a poll at least 30 seconds, however short pollInterval is', async () => {
            const miner = new TestPollingMiner(1000);
            miner.fetchStatsStub = () => new Promise<MinerStats>(() => {});

            await miner.init();
            await settle();

            expect(scheduled.map(t => t.ms)).to.deep.equal([30_000]);
            await miner.close();
        });

        it('does not publish stats that arrive after the timeout', async () => {
            const miner = new TestPollingMiner(1000);
            let finishPoll: (() => void) | undefined;
            miner.fetchStatsStub = () =>
                new Promise<MinerStats>(resolve => {
                    finishPoll = () => resolve({ power: 1 });
                });
            const received: MinerStats[] = [];
            miner.subscribeToStats(stats => {
                received.push(stats);
                return Promise.resolve();
            });

            await miner.init();
            await settle();
            // the timeout fires first ...
            await pollAgain();
            // ... then the stale poll finally answers
            finishPoll?.();
            await settle();

            expect(received).to.deep.equal([]);
            await miner.close();
        });
    });

    it('close() cancels the pending poll', async () => {
        const miner = new TestPollingMiner(1000);

        await miner.init();
        await settle();
        expect(scheduled).to.have.length(1);

        await miner.close();

        expect(scheduled).to.have.length(0);
    });

    it('close() stops polling even while a poll is still in flight', async () => {
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
        await settle();

        // the resolved poll must not have scheduled another one
        expect(scheduled).to.have.length(0);
        expect(fetchCount).to.equal(1);
    });
});
