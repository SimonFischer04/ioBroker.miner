import * as crypto from 'node:crypto';
import type { PoolSettings } from '../model/PoolSettings';
import type { PoolStats } from '../model/PoolStats';
import type { PoolFeatureKey } from '../model/PoolFeature';
import { Logger } from '../model/Logger';
import { asyncBackoffInterval, type AsyncIntervalReturnType } from '../../utils/delay';

/**
 * Upper limit for the time between polls while the pool API keeps failing.
 */
const MAX_POLL_BACKOFF_MS = 30 * 60 * 1000;

/**
 * Shorten each backoff delay randomly by up to 20 %, so accounts behind the same outage don't all retry at once.
 */
const POLL_BACKOFF_JITTER = 0.2;

/**
 * Failed polls in a row after which the pool is reported offline. A single failure is usually just a network hiccup.
 */
const OFFLINE_AFTER_FAILURES = 3;

/**
 * Lower limit for the time a single request of a poll may take before it counts as failed.
 */
const MIN_REQUEST_TIMEOUT_MS = 30_000;

/**
 * A mining pool account whose statistics are polled from the pool's API.
 */
export abstract class Pool<S extends PoolSettings> {
    protected logger: Logger;
    private statSubscriptions: ((stats: PoolStats) => Promise<void>)[] = [];
    private onlineStatusSubscriptions: ((online: boolean) => Promise<void>)[] = [];
    private pollHandle: AsyncIntervalReturnType | undefined;
    private online: boolean | undefined;
    private effectivePollInterval: number | undefined;
    private closed = false;
    /**
     * The subscriber notifications in progress, so {@link close} can wait for them.
     */
    private publishing: Promise<void> | undefined;

    /**
     * @param settings - pool-specific configuration
     */
    constructor(public readonly settings: S) {
        if (!settings.id) {
            this.settings.id = crypto.randomUUID();
        }
        this.logger = Logger.getLogger(this.getLoggerName());
    }

    /**
     * The features this pool reports.
     */
    public abstract getSupportedFeatures(): PoolFeatureKey[];

    /**
     * Fetch the current statistics from the pool API.
     *
     * A poll has no overall time limit, because its requests may have to wait their turn behind other accounts of the
     * same pool (rate limit). So every request made here has to end on its own: use {@link getRequestTimeoutMs} as
     * its timeout, and don't start requests once the pool {@link isClosed}.
     */
    public abstract fetchStats(): Promise<PoolStats>;

    /**
     * Smallest poll interval the pool's API allows. Shorter configured intervals are raised to it.
     */
    public getMinPollInterval(): number {
        return 1000;
    }

    /**
     * URL of the pool's web interface, if it has one.
     */
    public getWebUrl(): string | undefined {
        return undefined;
    }

    /**
     * Start polling the pool API.
     */
    public init(): Promise<void> {
        const pollInterval = this.getEffectivePollInterval();
        if (pollInterval !== this.settings.pollInterval) {
            const configured = this.settings.pollInterval;
            this.logger.warn(
                Number.isFinite(configured)
                    ? `pollInterval ${configured} is below the minimum of ${this.getMinPollInterval()}ms for this pool, using ${pollInterval}`
                    : `no valid pollInterval configured, using the minimum of ${pollInterval}ms for this pool`,
            );
        }
        this.logger.info(`initializing with interval ${pollInterval}`);

        this.closed = false;
        this.pollHandle = asyncBackoffInterval(
            async () => {
                const stats = await this.fetchStats();
                if (this.closed) {
                    return;
                }
                this.publishing = this.publish(stats);
                try {
                    await this.publishing;
                } finally {
                    this.publishing = undefined;
                }
            },
            pollInterval,
            {
                shouldExecuteImmediately: true,
                maxDelayMs: MAX_POLL_BACKOFF_MS,
                jitter: POLL_BACKOFF_JITTER,
                onError: (e, consecutiveFailures, nextDelayMs) => {
                    if (this.closed) {
                        return;
                    }
                    this.logger.error(
                        `fetchStats failed (failure #${consecutiveFailures}, next retry in ${nextDelayMs}ms): ${String(e)}`,
                    );
                    if (consecutiveFailures >= OFFLINE_AFTER_FAILURES) {
                        // tracked like a stats notification, so close() waits for it as well
                        const reporting = this.setOnline(false).finally(() => {
                            if (this.publishing === reporting) {
                                this.publishing = undefined;
                            }
                        });
                        this.publishing = reporting;
                    }
                },
            },
        );

        return Promise.resolve();
    }

    /**
     * The configured poll interval, raised to what the pool's API allows.
     */
    public getEffectivePollInterval(): number {
        if (this.effectivePollInterval === undefined) {
            const min = this.getMinPollInterval();
            const configured = this.settings.pollInterval;
            this.effectivePollInterval = Number.isFinite(configured) && configured >= min ? configured : min;
        }
        return this.effectivePollInterval;
    }

    /**
     * How long a single request of a poll may take before it counts as failed.
     */
    protected getRequestTimeoutMs(): number {
        return Math.max(this.getEffectivePollInterval(), MIN_REQUEST_TIMEOUT_MS);
    }

    /**
     * Whether {@link close} was called: nothing is requested or published any more.
     */
    protected isClosed(): boolean {
        return this.closed;
    }

    /**
     * Stop polling and drop all subscriptions. Once this has resolved, no subscriber is running or will be called
     * again: statistics that are being published right now are waited for, a poll still fetching is discarded.
     *
     * Must not be awaited from within a subscriber callback, which would wait for itself.
     */
    public async close(): Promise<void> {
        this.closed = true;
        this.pollHandle?.clear();
        this.pollHandle = undefined;
        try {
            await this.publishing;
        } catch {
            // already reported by the poll
        }
        this.statSubscriptions = [];
        this.onlineStatusSubscriptions = [];
    }

    /**
     * Report the pool online and hand new statistics to the subscribers.
     *
     * @param stats - the new statistics
     */
    private async publish(stats: PoolStats): Promise<void> {
        await this.setOnline(true);
        await this.onStats(stats);
    }

    /**
     * Subscribe to new statistics.
     *
     * @param callback - called with every successfully fetched set of statistics
     */
    public subscribeToStats(callback: (stats: PoolStats) => Promise<void>): void {
        this.statSubscriptions.push(callback);
    }

    /**
     * Subscribe to changes of whether the pool API is reachable.
     *
     * @param callback - called with the new status whenever it changes
     */
    public subscribeToOnlineStatus(callback: (online: boolean) => Promise<void>): void {
        this.onlineStatusSubscriptions.push(callback);
    }

    /**
     * Notify subscribers of new statistics.
     *
     * @param stats - the new statistics
     */
    protected async onStats(stats: PoolStats): Promise<void> {
        for (const sub of this.statSubscriptions) {
            await sub(stats);
        }
    }

    private async setOnline(online: boolean): Promise<void> {
        if (this.closed || this.online === online) {
            return;
        }
        this.online = online;

        if (!online) {
            this.logger.warn(`${OFFLINE_AFTER_FAILURES} polls in a row failed, reporting the pool as offline`);
        }
        for (const sub of this.onlineStatusSubscriptions) {
            try {
                await sub(online);
            } catch (e) {
                this.logger.error(`could not publish online status ${online}: ${String(e)}`);
            }
        }
    }

    /**
     * Name to use for the logger.
     */
    protected getLoggerName(): string {
        return `Pool[${this.settings.id}, ${this.settings.poolType}]`;
    }
}
