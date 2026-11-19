import { Pool } from './Pool';
import type { BraiinsPoolSettings } from '../model/PoolSettings';
import type { PoolStats, PoolWorkerState, PoolWorkerStats } from '../model/PoolStats';
import { PoolFeatureKey } from '../model/PoolFeature';
import { parseNumber, toHashesPerSecond } from '../../utils/hashrate-utils';
import { RequestThrottle } from '../../utils/request-throttle';

export const BRAIINS_POOL_DEFAULT_BASE_URL = 'https://pool.braiins.com';

/**
 * The pool API allows about one request every 5 seconds per client; exceeding it can get the IP banned.
 */
export const BRAIINS_POOL_REQUEST_SPACING_MS = 5_000;

/**
 * The pool updates its statistics about once a minute, and each poll makes two requests: polling more often than
 * every 30 seconds gains nothing and gets close to the rate limit with several accounts.
 */
export const BRAIINS_POOL_MIN_POLL_INTERVAL_MS = 30_000;

export const BRAIINS_POOL_DEFAULT_POLL_INTERVAL_MS = 60_000;

/**
 * Shared by all Braiins Pool accounts: the rate limit applies per IP, not per account.
 */
export const braiinsPoolThrottle = new RequestThrottle(BRAIINS_POOL_REQUEST_SPACING_MS);

/**
 * `GET /accounts/profile/json/btc/`
 */
export interface BraiinsPoolProfileResponse {
    /**
     *
     */
    username?: string;
    /**
     *
     */
    btc?: {
        all_time_reward?: string | number;
        hash_rate_unit?: string;
        hash_rate_5m?: string | number;
        hash_rate_60m?: string | number;
        hash_rate_24h?: string | number;
        hash_rate_yesterday?: string | number;
        low_workers?: number;
        off_workers?: number;
        ok_workers?: number;
        dis_workers?: number;
        current_balance?: string | number;
        today_reward?: string | number;
        estimated_reward?: string | number;
        shares_5m?: number;
        shares_60m?: number;
        shares_24h?: number;
        shares_yesterday?: number;
    };
}

/**
 * A worker of `GET /accounts/workers/json/btc/`
 */
export interface BraiinsPoolWorker {
    /**
     *
     */
    state?: string;
    /** unix seconds */
    last_share?: number;
    /**
     *
     */
    hash_rate_unit?: string;
    /**
     *
     */
    hash_rate_scoring?: string | number;
    /**
     *
     */
    hash_rate_5m?: string | number;
    /**
     *
     */
    hash_rate_60m?: string | number;
    /**
     *
     */
    hash_rate_24h?: string | number;
    /**
     *
     */
    shares_5m?: number;
    /**
     *
     */
    shares_60m?: number;
    /**
     *
     */
    shares_24h?: number;
}

/**
 * `GET /accounts/workers/json/btc/`
 */
export interface BraiinsPoolWorkersResponse {
    /**
     *
     */
    btc?: {
        workers?: Record<string, BraiinsPoolWorker>;
    };
}

const WORKER_STATES: Record<string, PoolWorkerState> = {
    ok: 'ok',
    low: 'low',
    off: 'off',
    dis: 'disabled',
};

/**
 * A Braiins Pool account (BTC), read via the pool's monitoring API.
 *
 * @see https://academy.braiins.com/en/braiins-pool/monitoring/
 */
export class BraiinsPool extends Pool<BraiinsPoolSettings> {
    /**
     *
     */
    public override getSupportedFeatures(): PoolFeatureKey[] {
        return [
            PoolFeatureKey.hashrate,
            PoolFeatureKey.workerCounts,
            PoolFeatureKey.rewards,
            PoolFeatureKey.workers,
            PoolFeatureKey.rawStats,
        ];
    }

    /**
     *
     */
    public override getMinPollInterval(): number {
        return BRAIINS_POOL_MIN_POLL_INTERVAL_MS;
    }

    /**
     *
     */
    public override getWebUrl(): string {
        return `${this.getBaseUrl()}/`;
    }

    /**
     *
     */
    public override async fetchStats(): Promise<PoolStats> {
        const profile = await this.request<BraiinsPoolProfileResponse>('accounts/profile/json/btc/');
        const workers = await this.request<BraiinsPoolWorkersResponse>('accounts/workers/json/btc/');
        return BraiinsPool.toPoolStats(profile, workers);
    }

    /**
     * Convert the API responses to {@link PoolStats}: hashrates to H/s, BTC amounts and timestamps to numbers.
     *
     * @param profile - response of the profile endpoint
     * @param workers - response of the workers endpoint
     */
    public static toPoolStats(profile: BraiinsPoolProfileResponse, workers: BraiinsPoolWorkersResponse): PoolStats {
        const account = profile.btc;
        if (!account) {
            throw new Error(`unexpected profile response: ${JSON.stringify(profile)}`);
        }
        const unit = account.hash_rate_unit;
        const workerList: unknown = workers?.btc?.workers;

        return {
            username: profile.username,
            hashrate5m: toHashesPerSecond(account.hash_rate_5m, unit),
            hashrate60m: toHashesPerSecond(account.hash_rate_60m, unit),
            hashrate24h: toHashesPerSecond(account.hash_rate_24h, unit),
            hashrateYesterday: toHashesPerSecond(account.hash_rate_yesterday, unit),
            workersOk: parseNumber(account.ok_workers),
            workersLow: parseNumber(account.low_workers),
            workersOff: parseNumber(account.off_workers),
            workersDisabled: parseNumber(account.dis_workers),
            currentBalance: parseNumber(account.current_balance),
            todayReward: parseNumber(account.today_reward),
            estimatedReward: parseNumber(account.estimated_reward),
            allTimeReward: parseNumber(account.all_time_reward),
            // Without a worker list the workers are unknown, which is not the same as an account without workers.
            // The same goes for a missing username: the object ids of the workers are derived from it.
            workers:
                isRecord(workerList) && profile.username
                    ? Object.entries(workerList)
                          .filter((entry): entry is [string, BraiinsPoolWorker] => isRecord(entry[1]))
                          .map(([name, worker]) => toWorkerStats(name, worker))
                    : undefined,
            raw: { profile, workers },
        };
    }

    /**
     *
     */
    protected override getLoggerName(): string {
        return `${super.getLoggerName()}BraiinsPool`;
    }

    private getBaseUrl(): string {
        return (this.settings.baseUrl || BRAIINS_POOL_DEFAULT_BASE_URL).replace(/\/+$/, '');
    }

    private request<T>(path: string): Promise<T> {
        const baseUrl = this.getBaseUrl();
        return braiinsPoolThrottle.run(
            baseUrl,
            async () => {
                this.logger.debug(`GET ${baseUrl}/${path}`);
                const response = await fetch(`${baseUrl}/${path}`, {
                    headers: {
                        Accept: 'application/json',
                        'Pool-Auth-Token': this.settings.apiToken,
                    },
                    signal: AbortSignal.timeout(this.getRequestTimeoutMs()),
                });

                if (!response.ok) {
                    // the start of the body usually says why, e.g. a proxy or bot protection answering instead of the API
                    const body = (await response.text().catch(() => '')).trim().slice(0, 200);
                    const details = body ? `: ${body}` : '';
                    if (response.status === 401 || response.status === 403) {
                        throw new Error(
                            `the pool rejected the API token (HTTP ${response.status}${details}). Check the access profile's token and that it has web API access`,
                        );
                    }
                    throw new Error(
                        `pool API request ${path} failed: HTTP ${response.status} ${response.statusText}${details}`,
                    );
                }
                return (await response.json()) as T;
            },
            // the request may have waited behind other accounts: a closed pool must not use a rate-limit slot
            () => this.isClosed(),
        );
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toWorkerStats(name: string, worker: BraiinsPoolWorker): PoolWorkerStats {
    const unit = worker.hash_rate_unit;
    const lastShare = parseNumber(worker.last_share);
    return {
        name,
        state: worker.state ? WORKER_STATES[worker.state] : undefined,
        lastShare: lastShare !== undefined ? lastShare * 1000 : undefined,
        hashrateScoring: toHashesPerSecond(worker.hash_rate_scoring, unit),
        hashrate5m: toHashesPerSecond(worker.hash_rate_5m, unit),
        hashrate60m: toHashesPerSecond(worker.hash_rate_60m, unit),
        hashrate24h: toHashesPerSecond(worker.hash_rate_24h, unit),
    };
}
