/**
 * What a pool implementation can report. The adapter only creates the states of the features a pool supports.
 */
export enum PoolFeatureKey {
    /** account hashrate averages (stats.hashrate5m, ...) */
    hashrate = 'hashrate',
    /** number of workers per monitoring state (stats.workersOk, ...) */
    workerCounts = 'workerCounts',
    /** balance and rewards (rewards.currentBalance, ...) */
    rewards = 'rewards',
    /** per-worker statistics (workers.<worker>.*) */
    workers = 'workers',
    /** raw API payloads (raw.stats) */
    rawStats = 'rawStats',
}
