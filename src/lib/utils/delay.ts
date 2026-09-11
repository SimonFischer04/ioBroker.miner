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
    // a fixed interval is just a backoff interval that always asks for the same delay
    return asyncBackoffInterval(
        async () => {
            await asyncCallback();
            return msBetweenExecutions;
        },
        msBetweenExecutions,
        shouldExecuteImmediately,
    );
}

/**
 * Like {@link asyncInterval} but the callback returns the delay (in ms) to use
 * before the next invocation, enabling dynamic backoff.
 *
 * The returned handle's `clear()` cancels the pending timer and stops the loop. A callback that is
 * already in flight when `clear()` is called still runs to completion, but no further invocation is
 * scheduled.
 *
 * @param asyncCallback - async function that returns the next delay in ms
 * @param initialDelayMs - delay before the first invocation (ignored when shouldExecuteImmediately is true)
 * @param shouldExecuteImmediately - whether to run the callback immediately
 */
export function asyncBackoffInterval(
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
