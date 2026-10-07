import {
    clearInterval as nodeClearInterval,
    clearTimeout as nodeClearTimeout,
    setInterval as nodeScheduleInterval,
    setTimeout as nodeScheduleTimeout,
} from 'node:timers';
import { setTimeout as nodeDelay } from 'node:timers/promises';

/**
 * Timer implementation used by delay helpers.
 */
export interface TimerBackend {
    /**
     * Schedules a callback and returns an implementation-specific handle.
     */
    schedule(callback: () => void, timeout: number): unknown;

    /**
     * Clears a handle returned by {@link schedule}.
     */
    clear(timer: unknown): void;

    /**
     * Schedules a repeating callback and returns an implementation-specific handle.
     */
    scheduleInterval(callback: () => void, interval: number): unknown;

    /**
     * Clears a handle returned by {@link scheduleInterval}.
     */
    clearInterval(timer: unknown): void;

    /**
     * Resolves after the given timeout.
     */
    delay(timeout: number): Promise<void>;
}

const nodeTimerBackend: TimerBackend = {
    schedule: (callback, timeout) => nodeScheduleTimeout(callback, timeout),
    clear: timer => nodeClearTimeout(timer as ReturnType<typeof nodeScheduleTimeout> | undefined),
    scheduleInterval: (callback, interval) => nodeScheduleInterval(callback, interval),
    clearInterval: timer => nodeClearInterval(timer as ReturnType<typeof nodeScheduleInterval> | undefined),
    delay: timeout => nodeDelay(timeout),
};

let timerBackend: TimerBackend = nodeTimerBackend;

/**
 * Overrides the timer backend used by this utility module.
 *
 * @param backend - timer backend to use for future delay/interval helpers
 */
export function setTimerBackend(backend: TimerBackend): void {
    timerBackend = backend;
}

/**
 * Restores the default node.js timer backend, e.g. after a test replaced it via {@link setTimerBackend}.
 */
export function resetTimerBackend(): void {
    timerBackend = nodeTimerBackend;
}

/**
 *
 * @param ms - the delay in milliseconds
 */
export async function delay(ms: number): Promise<void> {
    return timerBackend.delay(ms);
}

/**
 *
 * @param asyncCallback - the async callback to execute
 * @param executeEveryMs - the interval in milliseconds
 */
export function asyncIntervalNoWait(
    asyncCallback: () => Promise<void>,
    executeEveryMs: number,
): AsyncIntervalReturnType {
    const interval = timerBackend.scheduleInterval(() => {
        // make eslint not complain about no-misused-promises
        // because it is expected here that one callback may not complete (before another one start)
        void (async (): Promise<void> => {
            await asyncCallback();
        })();
    }, executeEveryMs);

    return {
        clear: (): void => {
            timerBackend.clearInterval(interval);
        },
    };
}

/**
 *
 */
export interface AsyncIntervalReturnType {
    /**
     *
     */
    clear: () => void;
}

/**
 * Interval with an async callback that decides the delay (in ms) before its next invocation.
 *
 * This is the single scheduling implementation the other interval helpers build on. The next
 * invocation is only scheduled once the callback has completed, so invocations never overlap.
 *
 * The returned handle's `clear()` cancels the pending timer and stops the loop. A callback that is
 * already in flight when `clear()` is called still runs to completion, but no further invocation is
 * scheduled.
 *
 * @param asyncCallback - async function that returns the next delay in ms
 * @param initialDelayMs - delay before the first invocation (ignored when shouldExecuteImmediately is true)
 * @param shouldExecuteImmediately - whether to run the callback immediately
 */
export function asyncDynamicInterval(
    asyncCallback: () => Promise<number>,
    initialDelayMs: number,
    shouldExecuteImmediately = false,
): AsyncIntervalReturnType {
    let timeout: unknown;
    let stopped = false;

    const callbackWrapper = (): void => {
        // make eslint not complain about no-misused-promises
        // recursive scheduling makes sure callback is completed before next execution
        void (async (): Promise<void> => {
            const nextDelay = await asyncCallback();

            // clearing an already fired timer is a no-op, so a clear() that happened while the
            // callback was awaited has to be caught here - otherwise the loop would run forever
            if (stopped) {
                return;
            }

            timeout = timerBackend.schedule(callbackWrapper, nextDelay);
        })();
    };

    if (shouldExecuteImmediately) {
        callbackWrapper();
    } else {
        timeout = timerBackend.schedule(callbackWrapper, initialDelayMs);
    }

    return {
        clear: (): void => {
            stopped = true;
            timerBackend.clear(timeout);
        },
    };
}

/**
 * Utility function to create an "interval" with async callback, that waits given ms between executions.
 *
 * @param asyncCallback The async callback function to run
 * @param msBetweenExecutions The amount of ms to wait between executions
 * @param shouldExecuteImmediately Whether to execute the callback immediately or after the specified delay
 * @returns An object with a `clear` method to stop the interval
 */
export function asyncInterval(
    asyncCallback: () => Promise<void>,
    msBetweenExecutions: number,
    shouldExecuteImmediately = false,
): AsyncIntervalReturnType {
    // a fixed interval is just a dynamic interval that always asks for the same delay
    return asyncDynamicInterval(
        async () => {
            await asyncCallback();
            return msBetweenExecutions;
        },
        msBetweenExecutions,
        shouldExecuteImmediately,
    );
}

/**
 * Default cap for the backoff exponent of {@link asyncBackoffInterval}: at most 2^5 = 32x the base delay.
 */
export const DEFAULT_MAX_BACKOFF_EXPONENT = 5;

/**
 * Options for {@link asyncBackoffInterval}.
 */
export interface AsyncBackoffIntervalOptions {
    /**
     * Run the callback immediately instead of waiting `baseDelayMs` first. Default: false.
     */
    shouldExecuteImmediately?: boolean;
    /**
     * Cap for the backoff exponent: the delay never exceeds `baseDelayMs * 2^maxBackoffExponent`.
     * Default: {@link DEFAULT_MAX_BACKOFF_EXPONENT}.
     */
    maxBackoffExponent?: number;
    /**
     * Absolute upper limit in ms for the delay after a failure, independent of `baseDelayMs`, so the worst
     * case stays predictable however long the base delay is. The delay never drops below `baseDelayMs`,
     * so a value below it effectively disables backing off.
     * Default: no limit besides `maxBackoffExponent`.
     */
    maxDelayMs?: number;
    /**
     * Randomly shortens each delay after a failure by up to this fraction (0 to 1), so intervals that failed
     * together - e.g. several devices behind the same network outage - don't all retry at the same moment.
     * Only delays after a failure are randomized: while the callback succeeds, the interval stays exactly
     * `baseDelayMs`. Because it only ever shortens, `maxDelayMs` stays a hard limit; the result never
     * drops below `baseDelayMs`.
     * Default: 0 (no randomness).
     */
    jitter?: number;
    /**
     * Called after every failed invocation.
     *
     * @param error - what the callback threw
     * @param consecutiveFailures - failures in a row, including this one
     * @param nextDelayMs - delay until the next attempt
     */
    onError?: (error: unknown, consecutiveFailures: number, nextDelayMs: number) => void;
}

/**
 * Interval with an async callback that backs off exponentially while the callback keeps failing.
 *
 * A callback that resolves counts as success: the next invocation follows after `baseDelayMs`.
 * A callback that throws counts as failure: the delay doubles with every failure in a row
 * (`baseDelayMs * 2^failures`, capped at `2^maxBackoffExponent` and at `maxDelayMs`, then optionally
 * shortened by `jitter`), and drops back to `baseDelayMs` on the next success. The failure count lives
 * in this interval, so every new interval starts fresh.
 *
 * @param asyncCallback - async function to run; throwing marks the invocation as failed
 * @param baseDelayMs - delay between invocations while the callback succeeds
 * @param options - see {@link AsyncBackoffIntervalOptions}
 * @returns An object with a `clear` method to stop the interval
 */
export function asyncBackoffInterval(
    asyncCallback: () => Promise<void>,
    baseDelayMs: number,
    options: AsyncBackoffIntervalOptions = {},
): AsyncIntervalReturnType {
    const {
        shouldExecuteImmediately = false,
        maxBackoffExponent = DEFAULT_MAX_BACKOFF_EXPONENT,
        maxDelayMs = Infinity,
        jitter = 0,
        onError,
    } = options;
    let consecutiveFailures = 0;

    return asyncDynamicInterval(
        async () => {
            try {
                await asyncCallback();
                consecutiveFailures = 0;
                return baseDelayMs;
            } catch (e) {
                consecutiveFailures++;
                const exponentialMs = baseDelayMs * 2 ** Math.min(consecutiveFailures, maxBackoffExponent);
                const cappedMs = Math.min(exponentialMs, maxDelayMs);
                // jitter only ever shortens the delay, so maxDelayMs stays a hard limit
                const jitteredMs = cappedMs * (1 - jitter * Math.random());
                const nextDelayMs = Math.max(baseDelayMs, Math.round(jitteredMs));
                onError?.(e, consecutiveFailures, nextDelayMs);
                return nextDelayMs;
            }
        },
        baseDelayMs,
        shouldExecuteImmediately,
    );
}

/**
 *
 * @param callback - the callback to execute
 * @param ms - the timeout in milliseconds
 */
export function timeout(callback: () => void, ms: number): AsyncIntervalReturnType {
    const handle = timerBackend.schedule(callback, ms);

    return {
        clear: (): void => {
            timerBackend.clear(handle);
        },
    };
}

/**
 *
 * @param asyncCallback - the async callback to execute
 * @param ms - the timeout in milliseconds
 */
export function asyncTimeout(asyncCallback: () => Promise<void>, ms: number): AsyncIntervalReturnType {
    const handle = timerBackend.schedule(() => {
        // make eslint not complain about no-misused-promises
        void (async (): Promise<void> => {
            await asyncCallback();
        })();
    }, ms);

    return {
        clear: (): void => {
            timerBackend.clear(handle);
        },
    };
}
