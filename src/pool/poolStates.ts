import { PoolFeatureKey } from '../lib/miner/model/PoolFeature';
import { poolWorkerStateKeys, type PoolStats, type PoolWorkerStats } from '../lib/miner/model/PoolStats';

/*
    Object model of a pool account (relative to miner.<instance>.pool.<poolId>):
      enabled
      info.{poolType, username, online, lastSeen}
      stats.{hashrate5m, hashrate60m, hashrate24h, hashrateYesterday, workersOk, workersLow, workersOff, workersDisabled}
      rewards.{currentBalance, todayReward, estimatedReward, allTimeReward}
      workers.<worker>.{name, state, lastShare, hashrateScoring, hashrate5m, hashrate60m, hashrate24h}
      raw.stats
 */

type StateCommon = Partial<ioBroker.StateCommon> & Pick<ioBroker.StateCommon, 'name' | 'type'>;

/**
 * A state of a pool account, relative to the device object.
 */
interface PoolStateDefinition {
    feature?: PoolFeatureKey;
    common: StateCommon;
    value?: (stats: PoolStats) => ioBroker.StateValue | undefined;
}

export const poolChannels: Record<string, string> = {
    info: 'pool account information',
    stats: 'pool statistics',
    rewards: 'rewards and balance',
    workers: 'workers',
    raw: 'raw API data',
};

const readOnly = { read: true, write: false } as const;

function hashrate(name: string): StateCommon {
    return { name, type: 'number', role: 'value', unit: 'H/s', ...readOnly };
}

function btc(name: string): StateCommon {
    return { name, type: 'number', role: 'value', unit: 'BTC', ...readOnly };
}

function count(name: string): StateCommon {
    return { name, type: 'number', role: 'value', ...readOnly };
}

const poolStates: Record<string, PoolStateDefinition> = {
    'info.poolType': { common: { name: 'Pool Type', type: 'string', role: 'text', ...readOnly } },
    'info.online': {
        common: { name: 'Online - pool API reachable', type: 'boolean', role: 'indicator.reachable', ...readOnly },
    },
    'info.lastSeen': { common: { name: 'Last Seen', type: 'number', role: 'date', ...readOnly } },
    'info.username': {
        common: { name: 'Username', type: 'string', role: 'text', ...readOnly },
        value: stats => stats.username,
    },

    'stats.hashrate5m': {
        feature: PoolFeatureKey.hashrate,
        common: hashrate('Hashrate (5 minutes average)'),
        value: stats => stats.hashrate5m,
    },
    'stats.hashrate60m': {
        feature: PoolFeatureKey.hashrate,
        common: hashrate('Hashrate (60 minutes average)'),
        value: stats => stats.hashrate60m,
    },
    'stats.hashrate24h': {
        feature: PoolFeatureKey.hashrate,
        common: hashrate('Hashrate (24 hours average)'),
        value: stats => stats.hashrate24h,
    },
    'stats.hashrateYesterday': {
        feature: PoolFeatureKey.hashrate,
        common: hashrate('Hashrate (average of yesterday)'),
        value: stats => stats.hashrateYesterday,
    },

    'stats.workersOk': {
        feature: PoolFeatureKey.workerCounts,
        common: count('Workers ok'),
        value: stats => stats.workersOk,
    },
    'stats.workersLow': {
        feature: PoolFeatureKey.workerCounts,
        common: count('Workers with low hashrate'),
        value: stats => stats.workersLow,
    },
    'stats.workersOff': {
        feature: PoolFeatureKey.workerCounts,
        common: count('Workers offline'),
        value: stats => stats.workersOff,
    },
    'stats.workersDisabled': {
        feature: PoolFeatureKey.workerCounts,
        common: count('Workers with monitoring disabled'),
        value: stats => stats.workersDisabled,
    },

    'rewards.currentBalance': {
        feature: PoolFeatureKey.rewards,
        common: btc('Current balance'),
        value: stats => stats.currentBalance,
    },
    'rewards.todayReward': {
        feature: PoolFeatureKey.rewards,
        common: btc('Confirmed reward today'),
        value: stats => stats.todayReward,
    },
    'rewards.estimatedReward': {
        feature: PoolFeatureKey.rewards,
        common: btc('Estimated reward'),
        value: stats => stats.estimatedReward,
    },
    'rewards.allTimeReward': {
        feature: PoolFeatureKey.rewards,
        common: btc('All-time reward'),
        value: stats => stats.allTimeReward,
    },

    'raw.stats': {
        feature: PoolFeatureKey.rawStats,
        common: { name: 'RAW Pool Stats', type: 'string', role: 'json', expert: true, ...readOnly },
        value: stats => (stats.raw !== undefined ? JSON.stringify(stats.raw) : undefined),
    },
};

const workerStates: Record<
    string,
    { common: StateCommon; value: (worker: PoolWorkerStats) => ioBroker.StateValue | undefined }
> = {
    name: {
        common: { name: 'Worker name', type: 'string', role: 'text', ...readOnly },
        value: worker => worker.name,
    },
    state: {
        common: {
            name: 'Monitoring state',
            type: 'string',
            role: 'text',
            states: Object.fromEntries(poolWorkerStateKeys.map(key => [key, key])),
            ...readOnly,
        },
        value: worker => worker.state,
    },
    lastShare: {
        common: { name: 'Last accepted share', type: 'number', role: 'date', ...readOnly },
        value: worker => worker.lastShare,
    },
    hashrateScoring: {
        common: hashrate('Scoring hashrate'),
        value: worker => worker.hashrateScoring,
    },
    hashrate5m: { common: hashrate('Hashrate (5 minutes average)'), value: worker => worker.hashrate5m },
    hashrate60m: { common: hashrate('Hashrate (60 minutes average)'), value: worker => worker.hashrate60m },
    hashrate24h: { common: hashrate('Hashrate (24 hours average)'), value: worker => worker.hashrate24h },
};

/**
 * The states (relative to the device object) to create for a pool supporting the given features.
 * Worker states are created on the fly, see {@link getWorkerStateObjects}.
 *
 * @param features - the features the pool supports
 */
export function getPoolStateObjects(features: readonly PoolFeatureKey[]): Record<string, StateCommon> {
    return Object.fromEntries(
        Object.entries(poolStates)
            .filter(([, def]) => def.feature === undefined || features.includes(def.feature))
            .map(([id, def]) => [id, def.common]),
    );
}

/**
 * The state values (relative to the device object) to write for new pool statistics. Values the pool didn't report
 * are left out, so they keep their last value.
 *
 * @param stats - the new statistics
 * @param features - the features the pool supports
 */
export function getPoolStateValues(
    stats: PoolStats,
    features: readonly PoolFeatureKey[],
): Record<string, ioBroker.StateValue> {
    const values: Record<string, ioBroker.StateValue> = {};
    for (const [id, def] of Object.entries(poolStates)) {
        if (!def.value || (def.feature !== undefined && !features.includes(def.feature))) {
            continue;
        }
        const value = def.value(stats);
        if (value !== undefined) {
            values[id] = value;
        }
    }
    return values;
}

/**
 * Object id segment for a worker. Pool worker names are usually `<username>.<worker>`: the username is the same for
 * all workers of the account, so only the part after it is used. Characters not allowed in object ids are replaced.
 *
 * @param workerName - the worker name as the pool reports it
 * @param username - the account's username, if known
 */
export function getWorkerObjectId(workerName: string, username?: string): string {
    let name = workerName;
    if (username && name.startsWith(`${username}.`)) {
        name = name.slice(username.length + 1);
    }
    const id = name.replace(/[^A-Za-z0-9_-]/g, '_');
    return id === '' ? '_' : id;
}

/**
 * The states (relative to the worker channel) of a worker.
 */
export function getWorkerStateObjects(): Record<string, StateCommon> {
    return Object.fromEntries(Object.entries(workerStates).map(([id, def]) => [id, def.common]));
}

/**
 * The state values (relative to the worker channel) to write for a worker.
 *
 * @param worker - the worker statistics
 */
export function getWorkerStateValues(worker: PoolWorkerStats): Record<string, ioBroker.StateValue> {
    const values: Record<string, ioBroker.StateValue> = {};
    for (const [id, def] of Object.entries(workerStates)) {
        const value = def.value(worker);
        if (value !== undefined) {
            values[id] = value;
        }
    }
    return values;
}
