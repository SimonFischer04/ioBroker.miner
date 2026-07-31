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
    const delays: number[] = [];
    let resolveDelay: (() => void) | undefined;
    let pollCount: number;
    const maxPolls = 6;

    const fakeBackend: TimerBackend = {
        schedule: (cb, timeout) => setTimeout(cb, timeout),
        clear: timer => clearTimeout(timer as ReturnType<typeof setTimeout>),
        scheduleInterval: (cb, interval) => setInterval(cb, interval),
        clearInterval: timer => clearInterval(timer as ReturnType<typeof setInterval>),
        delay: (ms: number) => {
            delays.push(ms);
            pollCount++;
            if (pollCount >= maxPolls && resolveDelay) {
                resolveDelay();
            }
            return Promise.resolve();
        },
    };

    beforeEach(() => {
        delays.length = 0;
        pollCount = 0;
        resolveDelay = undefined;
        setTimerBackend(fakeBackend);
    });

    afterEach(() => {
        // restore node backend
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
            resolveDelay = resolve;
        });

        await miner.init();
        await done;
        await miner.close();

        // All delays should be the base interval (1000ms) since no failures
        for (const d of delays) {
            expect(d).to.equal(1000);
        }
    });

    it('increases delay exponentially on consecutive failures', async () => {
        const miner = new TestPollingMiner(1000);
        miner.fetchStatsStub = () => Promise.reject(new Error('connection failed'));

        const done = new Promise<void>(resolve => {
            resolveDelay = resolve;
        });

        await miner.init();
        await done;
        await miner.close();

        // First poll succeeds at base, then failures: 2000, 4000, 8000, 16000, 32000
        expect(delays[0]).to.equal(2000); // 1000 * 2^1
        expect(delays[1]).to.equal(4000); // 1000 * 2^2
        expect(delays[2]).to.equal(8000); // 1000 * 2^3
        expect(delays[3]).to.equal(16000); // 1000 * 2^4
        expect(delays[4]).to.equal(32000); // 1000 * 2^5 (max)
        expect(delays[5]).to.equal(32000); // stays at max
    });

    it('resets delay after successful poll', async () => {
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
            resolveDelay = resolve;
        });

        await miner.init();
        await done;
        await miner.close();

        // First 3 failures: 2000, 4000, 8000
        expect(delays[0]).to.equal(2000);
        expect(delays[1]).to.equal(4000);
        expect(delays[2]).to.equal(8000);
        // After success, reset to base
        expect(delays[3]).to.equal(1000);
    });
});
