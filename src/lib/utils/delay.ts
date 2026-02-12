/**
 *
 * @param ms
 */
export async function delay(ms: number): Promise<unknown> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function asyncIntervalNoWait(asyncCallback: () => Promise<void>, executeEveryMs?: number): NodeJS.Timeout {
    return setInterval(() => {
        // make eslint not complain about no-misused-promises
        // because it is expected here that one callback may not complete (before another one start)
        void (async (): Promise<void> => {
            await asyncCallback();
        })();
    }, executeEveryMs);
}

export interface AsyncIntervalReturnType {
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
    msBetweenExecutions?: number,
    shouldExecuteImmediately = false,
): AsyncIntervalReturnType {
    let timeout: NodeJS.Timeout | undefined;

    const callbackWrapper = (): void => {
        // make eslint not complain about no-misused-promises
        // recursive setTimeout makes sure callback is completed before next execution
        void (async (): Promise<void> => {
            await asyncCallback();
            timeout = setTimeout(callbackWrapper, msBetweenExecutions);
        })();
    };

    if (shouldExecuteImmediately) {
        void (async (): Promise<void> => {
            await asyncCallback();
            timeout = setTimeout(callbackWrapper, msBetweenExecutions);
        })();
    } else {
        timeout = setTimeout(callbackWrapper, msBetweenExecutions);
    }

    return {
        clear: (): void => {
            clearTimeout(timeout);
        },
    };
}

export function asyncTimeout(asyncCallback: () => Promise<void>, ms: number): NodeJS.Timeout {
    return setTimeout(() => {
        // make eslint not complain about no-misused-promises
        void (async (): Promise<void> => {
            await asyncCallback();
        })();
    }, ms);
}
