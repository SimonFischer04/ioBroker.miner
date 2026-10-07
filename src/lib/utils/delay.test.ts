import { expect } from 'chai';
import {
    asyncBackoffInterval,
    asyncDynamicInterval,
    asyncInterval,
    resetTimerBackend,
    setTimerBackend,
    type AsyncBackoffIntervalOptions,
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
         * @param options - backoff options besides shouldExecuteImmediately
         */
        async function delaysFor(
            script: boolean[],
            options: Omit<AsyncBackoffIntervalOptions, 'shouldExecuteImmediately'> = {},
        ): Promise<number[]> {
            asyncBackoffInterval(scripted(script), 1000, { ...options, shouldExecuteImmediately: true });
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
            expect(await delaysFor([false, false, false, false], { maxBackoffExponent: 2 })).to.deep.equal([
                2000, 4000, 4000, 4000,
            ]);
        });

        it('limits the delay to maxDelayMs, however large the exponential delay gets', async () => {
            expect(await delaysFor([false, false, false, false, false], { maxDelayMs: 5000 })).to.deep.equal([
                2000, 4000, 5000, 5000, 5000,
            ]);
        });

        it('never waits less than the base delay, even with maxDelayMs below it', async () => {
            expect(await delaysFor([false, false, false], { maxDelayMs: 500 })).to.deep.equal([1000, 1000, 1000]);
        });

        describe('jitter', () => {
            const realRandom = Math.random;

            /**
             * Makes Math.random return a fixed value for the rest of the test.
             *
             * @param value - what Math.random returns, in [0, 1)
             */
            function randomReturns(value: number): void {
                Math.random = () => value;
            }

            afterEach(() => {
                Math.random = realRandom;
            });

            it('shortens each failure delay by a random share of up to the given fraction', async () => {
                randomReturns(0.5);
                // 0.2 * 0.5 = 10 % shorter
                expect(await delaysFor([false, false, false], { jitter: 0.2 })).to.deep.equal([1800, 3600, 7200]);
            });

            it('changes nothing when the random draw is 0', async () => {
                randomReturns(0);
                expect(await delaysFor([false, false, false], { jitter: 0.2 })).to.deep.equal([2000, 4000, 8000]);
            });

            it('does not randomize the interval while the callback succeeds', async () => {
                randomReturns(0.99);
                expect(await delaysFor([true, true, false, true], { jitter: 0.5 })).to.deep.equal([
                    1000,
                    1000,
                    Math.round(2000 * (1 - 0.5 * 0.99)),
                    1000,
                ]);
            });

            it('reaches exactly maxDelayMs at the lowest random draw', async () => {
                randomReturns(0);
                expect(await delaysFor([false, false, false, false], { maxDelayMs: 5000, jitter: 0.2 })).to.deep.equal([
                    2000, 4000, 5000, 5000,
                ]);
            });

            it('keeps maxDelayMs a hard limit at any random draw, since it only ever shortens', async () => {
                randomReturns(0.99);
                // the cap applies first, then jitter shortens: 5000 * (1 - 0.2 * 0.99) = 4010
                const delays = await delaysFor([false, false, false, false], { maxDelayMs: 5000, jitter: 0.2 });

                expect(delays).to.deep.equal([1604, 3208, 4010, 4010]);
                expect(delays.every(d => d <= 5000)).to.equal(true);
            });

            it('never shortens a delay below the base delay', async () => {
                randomReturns(0.99);
                // a full-strength jitter would bring 2000 down to 20
                expect(await delaysFor([false, false], { jitter: 1 })).to.deep.equal([1000, 1000]);
            });

            it('reports the actual, randomized delay to onError', async () => {
                randomReturns(0.5);
                const reported: number[] = [];
                asyncBackoffInterval(scripted([false]), 1000, {
                    shouldExecuteImmediately: true,
                    jitter: 0.2,
                    onError: (_e, _failures, nextDelayMs) => reported.push(nextDelayMs),
                });
                await settle();

                expect(reported).to.deep.equal([1800]);
                expect(timers.scheduled.map(t => t.ms)).to.deep.equal([1800]);
            });
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
