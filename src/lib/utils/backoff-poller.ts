import type { Logger } from '../miner/model/Logger';
import { asyncBackoffInterval, withTimeout, type AsyncIntervalReturnType } from './delay';

/**
 * Shorten each backoff delay randomly by up to 20 %, so devices behind the same outage don't all retry at once.
 */
const POLL_BACKOFF_JITTER = 0.2;

/**
 * Failed polls in a row after which the device is reported offline. A single failure is usually just a network hiccup.
 */
const OFFLINE_AFTER_FAILURES = 3;

/**
 * Lower limit for the time a poll (or a single request of it) may take before it counts as failed.
 */
const MIN_POLL_TIMEOUT_MS = 30_000;

/**
 * How long a poll, or a single request of it, may take before it counts as failed: as long as the poll interval,
 * but at least 30 seconds.
 *
 * @param pollIntervalMs - the time between polls
 */
export function getPollTimeoutMs(pollIntervalMs: number): number {
    return Math.max(pollIntervalMs, MIN_POLL_TIMEOUT_MS);
}

/**
 * Options for {@link BackoffPoller}.
 */
export interface BackoffPollerOptions<T> {
    /**
     * What is polled, for log messages, e.g. `miner` or `pool`.
     */
    subject: string;
    /**
     * Logger of the polled device.
     */
    logger: Logger;
    /**
     * Time between polls while they succeed.
     */
    pollIntervalMs: number;
    /**
     * Upper limit for the time between polls while they keep failing, however long the poll interval is.
     */
    maxBackoffMs: number;
    /**
     * A poll taking longer than this counts as failed, so that one that hangs (e.g. a connection that is never
     * answered) gets the device reported offline. Leave out for no limit - then `fetch` has to end on its own.
     */
    pollTimeoutMs?: number;
    /**
     * Fetches the current statistics. Throwing marks the poll as failed.
     */
    fetch: () => Promise<T>;
    /**
     * Hands the statistics of a successful poll to whoever is interested.
     */
    publishStats: (stats: T) => Promise<void>;
    /**
     * Reports that the device became reachable or unreachable. Only called when the status changes.
     */
    publishOnlineStatus: (online: boolean) => Promise<void>;
}

/**
 * Polls a device for statistics: right away, then every poll interval, backing off exponentially while polls keep
 * failing. Reports the device online with the first successful poll and offline after 3 failed polls in a row.
 */
export class BackoffPoller<T> {
    private handle: AsyncIntervalReturnType | undefined;
    private online: boolean | undefined;
    private stopped = false;
    /**
     * The notifications in progress, so {@link stop} can wait for them.
     */
    private readonly publishing = new Set<Promise<void>>();

    /**
     * @param options - what to poll and how
     */
    constructor(private readonly options: BackoffPollerOptions<T>) {}

    /**
     * Start polling. The first poll runs right away.
     */
    public start(): void {
        const { logger, pollIntervalMs, maxBackoffMs, pollTimeoutMs } = this.options;

        this.handle?.clear();
        this.stopped = false;
        this.handle = asyncBackoffInterval(
            async () => {
                logger.debug('next poll interval time reached. calling fetchStats()');
                const fetching = this.options.fetch();
                const stats =
                    pollTimeoutMs === undefined
                        ? await fetching
                        : await withTimeout(
                              fetching,
                              pollTimeoutMs,
                              `fetchStats did not finish within ${pollTimeoutMs}ms`,
                          );
                if (this.stopped) {
                    return;
                }
                await this.track(this.publish(stats));
            },
            pollIntervalMs,
            {
                shouldExecuteImmediately: true,
                maxDelayMs: maxBackoffMs,
                jitter: POLL_BACKOFF_JITTER,
                onError: (e, consecutiveFailures, nextDelayMs) => {
                    if (this.stopped) {
                        return;
                    }
                    logger.error(
                        `fetchStats failed (failure #${consecutiveFailures}, next retry in ${nextDelayMs}ms): ${String(e)}`,
                    );
                    if (consecutiveFailures >= OFFLINE_AFTER_FAILURES) {
                        // never rejects, see setOnline
                        void this.track(this.setOnline(false));
                    }
                },
            },
        );
    }

    /**
     * Stop polling. Once this has resolved, nothing is being published or will be published again: notifications in
     * progress are waited for, a poll that is still fetching is discarded.
     *
     * Must not be awaited from within `publishStats` / `publishOnlineStatus`, which would wait for itself.
     */
    public async stop(): Promise<void> {
        this.stopped = true;
        this.handle?.clear();
        this.handle = undefined;
        // failures were already reported by the poll
        await Promise.allSettled([...this.publishing]);
    }

    private async publish(stats: T): Promise<void> {
        await this.setOnline(true);
        await this.options.publishStats(stats);
    }

    /**
     * Report a change of the online status. Repeating the current status does nothing.
     *
     * @param online - whether the last poll(s) reached the device
     */
    private async setOnline(online: boolean): Promise<void> {
        if (this.online === online) {
            return;
        }
        this.online = online;

        if (!online) {
            this.options.logger.warn(
                `${OFFLINE_AFTER_FAILURES} polls in a row failed, reporting the ${this.options.subject} as offline`,
            );
        }
        try {
            await this.options.publishOnlineStatus(online);
        } catch (e) {
            this.options.logger.error(`could not publish online status ${online}: ${String(e)}`);
        }
    }

    /**
     * Remember a notification until it is done.
     *
     * @param work - the notification in progress
     */
    private track(work: Promise<void>): Promise<void> {
        this.publishing.add(work);
        return work.finally(() => this.publishing.delete(work));
    }
}
