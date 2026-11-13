/**
 * Monitoring state of a worker, as the pool reports it.
 * - ok: hashing normally
 * - low: hashrate below the monitoring threshold
 * - off: no shares received recently
 * - disabled: monitoring is turned off for the worker
 */
export const poolWorkerStateKeys = ['ok', 'low', 'off', 'disabled'] as const;

export type PoolWorkerState = (typeof poolWorkerStateKeys)[number];

/**
 * Statistics of a single worker (miner connected to the pool).
 */
export interface PoolWorkerStats {
    /**
     * Worker name as the pool reports it, usually `<username>.<worker>`.
     */
    name: string;
    /**
     * Monitoring state of the worker.
     */
    state?: PoolWorkerState;
    /**
     * Time of the last accepted share, in unix milliseconds.
     */
    lastShare?: number;
    /**
     * Hashrate used for reward calculation, in H/s.
     */
    hashrateScoring?: number;
    /**
     * Average hashrate over the last 5 minutes, in H/s.
     */
    hashrate5m?: number;
    /**
     * Average hashrate over the last 60 minutes, in H/s.
     */
    hashrate60m?: number;
    /**
     * Average hashrate over the last 24 hours, in H/s.
     */
    hashrate24h?: number;
}

/**
 * Statistics of a pool account.
 */
export interface PoolStats {
    /**
     * Account name at the pool.
     */
    username?: string;
    /**
     * Average hashrate of the account over the last 5 minutes, in H/s.
     */
    hashrate5m?: number;
    /**
     * Average hashrate of the account over the last 60 minutes, in H/s.
     */
    hashrate60m?: number;
    /**
     * Average hashrate of the account over the last 24 hours, in H/s.
     */
    hashrate24h?: number;
    /**
     * Average hashrate of the account on the previous (UTC) day, in H/s.
     */
    hashrateYesterday?: number;
    /**
     * Number of workers in state ok.
     */
    workersOk?: number;
    /**
     * Number of workers in state low.
     */
    workersLow?: number;
    /**
     * Number of workers in state off.
     */
    workersOff?: number;
    /**
     * Number of workers with monitoring disabled.
     */
    workersDisabled?: number;
    /**
     * Reward balance not paid out yet, in the pool's coin (BTC).
     */
    currentBalance?: number;
    /**
     * Confirmed reward for today, in the pool's coin (BTC).
     */
    todayReward?: number;
    /**
     * Estimated reward for the current block / day, in the pool's coin (BTC).
     */
    estimatedReward?: number;
    /**
     * Total reward since the account was created, in the pool's coin (BTC).
     */
    allTimeReward?: number;
    /**
     * Per-worker statistics: all workers of the account. Undefined if the pool didn't report its workers.
     */
    workers?: PoolWorkerStats[];
    /**
     * Raw API response payloads.
     */
    raw?: object;
}
