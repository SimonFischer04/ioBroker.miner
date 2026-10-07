import { expect } from 'chai';
import {
    asyncBackoffInterval,
    asyncDynamicInterval,
    asyncInterval,
    resetTimerBackend,
    setTimerBackend,
    type TimerBackend,
} from './delay';

interface ScheduledTimer {
    callback: () => void;
    ms: number;
}

/**
 * Timer backend that never fires on its own: the test decides when the next scheduled callback runs.
 */
class ManualTimerBackend implements TimerBackend {
    public readonly scheduled: ScheduledTimer[] = [];

    public schedule(callback: () => void, ms: number): unknown {
        const timer = { callback, ms };
        this.scheduled.push(timer);
        return timer;
    }

    public clear(timer: unknown): void {
        const index = this.scheduled.indexOf(timer as ScheduledTimer);
        if (index >= 0) {
            this.scheduled.splice(index, 1);
        }
    }

    public scheduleInterval(): unknown {
        throw new Error('not used by these tests');
    }

    public clearInterval(): void {
        throw new Error('not used by these tests');
    }

    public delay(): Promise<void> {
        throw new Error('not used by these tests');
    }

    /**
     * Runs the oldest scheduled callback and waits until everything it kicked off has settled.
     *
     * @returns the delay that callback was scheduled with
     */
    public async fireNext(): Promise<number> {
        const timer = this.scheduled.shift();
        if (!timer) {
            throw new Error('no timer scheduled');
        }
        timer.callback();
        await settle();
        return timer.ms;
    }
}

/**
 * Waits until all pending promise continuations have run.
 */
function settle(): Promise<void> {
    return new Promise(resolve => setImmediate(resolve));
}

describe('delay', () => {
    let timers: ManualTimerBackend;

    beforeEach(() => {
        timers = new ManualTimerBackend();
        setTimerBackend(timers);
    });

    afterEach(() => {
        resetTimerBackend();
    });

    describe('asyncDynamicInterval', () => {
        it('schedules each next invocation with the delay the callback returns', async () => {
            const delays = [300, 100, 200];
            let calls = 0;
            asyncDynamicInterval(() => Promise.resolve(delays[calls++]), 50);

            expect(await timers.fireNext()).to.equal(50); // initial delay
            expect(await timers.fireNext()).to.equal(300);
            expect(await timers.fireNext()).to.equal(100);
            expect(timers.scheduled.map(t => t.ms)).to.deep.equal([200]);
        });

        it('runs the callback right away when shouldExecuteImmediately is set', async () => {
            let calls = 0;
            asyncDynamicInterval(
                () => {
                    calls++;
                    return Promise.resolve(100);
                },
                50,
                true,
            );
            await settle();

            expect(calls).to.equal(1);
            expect(timers.scheduled.map(t => t.ms)).to.deep.equal([100]);
        });

        it('clear() cancels the pending timer', async () => {
            const handle = asyncDynamicInterval(() => Promise.resolve(100), 50, true);
            await settle();
            expect(timers.scheduled).to.have.length(1);

            handle.clear();

            expect(timers.scheduled).to.have.length(0);
        });

        it('clear() stops the loop even while the callback is still in flight', async () => {
            let calls = 0;
            let finishCallback: (() => void) | undefined;
            const handle = asyncDynamicInterval(
                () => {
                    calls++;
                    return new Promise<number>(resolve => {
                        finishCallback = () => resolve(100);
                    });
                },
                50,
                true,
            );
            await settle();
            expect(calls).to.equal(1);

            // the callback's timer has already fired, so there is nothing pending to cancel
            handle.clear();
            finishCallback?.();
            await settle();

            // the completed callback must not have re-armed the loop
            expect(timers.scheduled).to.have.length(0);
            expect(calls).to.equal(1);
        });
    });

    describe('asyncInterval', () => {
        it('always waits the same delay between invocations', async () => {
            let calls = 0;
            asyncInterval(() => {
                calls++;
                return Promise.resolve();
            }, 100);

            expect(await timers.fireNext()).to.equal(100);
            expect(await timers.fireNext()).to.equal(100);
            expect(calls).to.equal(2);
            expect(timers.scheduled.map(t => t.ms)).to.deep.equal([100]);
        });
    });

    describe('asyncBackoffInterval', () => {
        /**
         * Callback that succeeds or fails according to the given script, one entry per invocation.
         *
         * @param script - `true` for success, `false` for failure
         */
        function scripted(script: boolean[]): () => Promise<void> {
            let call = 0;
            return () => (script[call++] ? Promise.resolve() : Promise.reject(new Error(`failure ${call}`)));
        }

        /**
         * Starts an immediately-executing backoff interval and collects the delay scheduled after each invocation.
         *
         * @param script - `true` for success, `false` for failure, one entry per invocation
         * @param maxBackoffExponent - optional cap, defaults to the helper's default
         */
        async function delaysFor(script: boolean[], maxBackoffExponent?: number): Promise<number[]> {
            asyncBackoffInterval(scripted(script), 1000, { shouldExecuteImmediately: true, maxBackoffExponent });
            await settle();

            const delays: number[] = [];
            for (let i = 1; i < script.length; i++) {
                delays.push(await timers.fireNext());
            }
            // the delay scheduled after the last invocation
            delays.push(timers.scheduled[0].ms);
            return delays;
        }

        it('waits the base delay while the callback succeeds', async () => {
            expect(await delaysFor([true, true, true])).to.deep.equal([1000, 1000, 1000]);
        });

        it('doubles the delay with every failure in a row, capped at 2^5 by default', async () => {
            expect(await delaysFor([false, false, false, false, false, false, false])).to.deep.equal([
                2000, 4000, 8000, 16000, 32000, 32000, 32000,
            ]);
        });

        it('respects a custom maxBackoffExponent', async () => {
            expect(await delaysFor([false, false, false, false], 2)).to.deep.equal([2000, 4000, 4000, 4000]);
        });

        it('drops back to the base delay after a success, and starts counting from scratch', async () => {
            expect(await delaysFor([false, false, false, true, false])).to.deep.equal([2000, 4000, 8000, 1000, 2000]);
        });

        it('waits the base delay before the first invocation unless shouldExecuteImmediately is set', async () => {
            let calls = 0;
            asyncBackoffInterval(() => {
                calls++;
                return Promise.resolve();
            }, 1000);
            await settle();

            expect(calls).to.equal(0);
            expect(timers.scheduled.map(t => t.ms)).to.deep.equal([1000]);
        });

        it('reports every failure to onError with the failure count and the next delay', async () => {
            const reported: [string, number, number][] = [];
            asyncBackoffInterval(scripted([false, false, true, false]), 1000, {
                shouldExecuteImmediately: true,
                onError: (e, consecutiveFailures, nextDelayMs) => {
                    reported.push([(e as Error).message, consecutiveFailures, nextDelayMs]);
                },
            });
            await settle();
            await timers.fireNext();
            await timers.fireNext();
            await timers.fireNext();

            expect(reported).to.deep.equal([
                ['failure 1', 1, 2000],
                ['failure 2', 2, 4000],
                // success in between: not reported, resets the count
                ['failure 4', 1, 2000],
            ]);
        });

        it('keeps the failure count per interval, so a new interval starts fresh', async () => {
            const failing = (): Promise<void> => Promise.reject(new Error('down'));

            const first = asyncBackoffInterval(failing, 1000, { shouldExecuteImmediately: true });
            await settle();
            await timers.fireNext();
            await timers.fireNext();
            expect(timers.scheduled.map(t => t.ms)).to.deep.equal([8000]);
            first.clear();

            asyncBackoffInterval(failing, 1000, { shouldExecuteImmediately: true });
            await settle();
            expect(timers.scheduled.map(t => t.ms)).to.deep.equal([2000]);
        });
    });
});
