import * as crypto from 'node:crypto';
import type { PoolSettings } from '../model/PoolSettings';
import type { PoolStats } from '../model/PoolStats';
import type { PoolFeatureKey } from '../model/PoolFeature';
import { Logger } from '../model/Logger';
import { BackoffPoller, getPollTimeoutMs } from '../../utils/backoff-poller';

/**
 * Upper limit for the time between polls while the pool API keeps failing.
 */
const MAX_POLL_BACKOFF_MS = 30 * 60 * 1000;

/**
 * A mining pool account whose statistics are polled from the pool's API.
 */
export abstract class Pool<S extends PoolSettings> {
    protected logger: Logger;
    private statSubscriptions: ((stats: PoolStats) => Promise<void>)[] = [];
    private onlineStatusSubscriptions: ((online: boolean) => Promise<void>)[] = [];
    private poller: BackoffPoller<PoolStats> | undefined;
    private effectivePollInterval: number | undefined;
    private closed = false;

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
        this.poller = new BackoffPoller<PoolStats>({
            subject: 'pool',
            logger: this.logger,
            pollIntervalMs: pollInterval,
            maxBackoffMs: MAX_POLL_BACKOFF_MS,
            // no pollTimeoutMs: see fetchStats
            fetch: () => this.fetchStats(),
            publishStats: stats => this.onStats(stats),
            publishOnlineStatus: online => this.onOnlineStatus(online),
        });
        this.poller.start();

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
        return getPollTimeoutMs(this.getEffectivePollInterval());
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
        await this.poller?.stop();
        this.poller = undefined;
        this.statSubscriptions = [];
        this.onlineStatusSubscriptions = [];
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

    /**
     * Notify subscribers that the pool API became reachable or unreachable.
     *
     * @param online - whether the pool API is reachable now
     */
    protected async onOnlineStatus(online: boolean): Promise<void> {
        for (const sub of this.onlineStatusSubscriptions) {
            await sub(online);
        }
    }

    /**
     * Name to use for the logger.
     */
    protected getLoggerName(): string {
        return `Pool[${this.settings.id}, ${this.settings.poolType}]`;
    }
}
