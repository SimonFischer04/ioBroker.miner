import * as crypto from 'node:crypto';
import type { PoolSettings } from '../model/PoolSettings';
import type { PoolStats } from '../model/PoolStats';
import type { PoolFeatureKey } from '../model/PoolFeature';
import { Logger } from '../model/Logger';
import { asyncBackoffInterval, withTimeout, type AsyncIntervalReturnType } from '../../utils/delay';

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
 * Lower limit for the time a single poll may take before it counts as failed.
 */
const MIN_POLL_TIMEOUT_MS = 30_000;

/**
 * A mining pool account whose statistics are polled from the pool's API.
 */
export abstract class Pool<S extends PoolSettings> {
    protected logger: Logger;
    private statSubscriptions: ((stats: PoolStats) => Promise<void>)[] = [];
    private onlineStatusSubscriptions: ((online: boolean) => Promise<void>)[] = [];
    private pollHandle: AsyncIntervalReturnType | undefined;
    private online: boolean | undefined;

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
        this.logger.info(`initializing with interval ${pollInterval}`);

        const pollTimeoutMs = this.getPollTimeoutMs();
        this.pollHandle = asyncBackoffInterval(
            async () => {
                const stats = await withTimeout(
                    this.fetchStats(),
                    pollTimeoutMs,
                    `fetchStats did not finish within ${pollTimeoutMs}ms`,
                );
                await this.setOnline(true);
                await this.onStats(stats);
            },
            pollInterval,
            {
                shouldExecuteImmediately: true,
                maxDelayMs: MAX_POLL_BACKOFF_MS,
                jitter: POLL_BACKOFF_JITTER,
                onError: (e, consecutiveFailures, nextDelayMs) => {
                    this.logger.error(
                        `fetchStats failed (failure #${consecutiveFailures}, next retry in ${nextDelayMs}ms): ${String(e)}`,
                    );
                    if (consecutiveFailures >= OFFLINE_AFTER_FAILURES) {
                        void this.setOnline(false);
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
        const min = this.getMinPollInterval();
        const configured = this.settings.pollInterval;
        if (!Number.isFinite(configured) || configured < min) {
            this.logger.warn(`pollInterval ${configured} is below the minimum of ${min}ms for this pool, using ${min}`);
            return min;
        }
        return configured;
    }

    /**
     * How long a single poll may take before it counts as failed.
     */
    protected getPollTimeoutMs(): number {
        return Math.max(this.getEffectivePollInterval(), MIN_POLL_TIMEOUT_MS);
    }

    /**
     * Stop polling and drop all subscriptions.
     */
    public close(): Promise<void> {
        this.pollHandle?.clear();
        this.pollHandle = undefined;
        this.statSubscriptions = [];
        this.onlineStatusSubscriptions = [];
        return Promise.resolve();
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
        if (this.online === online) {
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
