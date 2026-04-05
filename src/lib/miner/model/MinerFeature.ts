export enum MinerFeatureKey {
    running = 'running',
    rawStats = 'rawStats',
    version = 'version',
    totalHashrate = 'totalHashrate',
}

export enum MinerFeatureCategory {
    control = 'control',
    info = 'info',
    stats = 'stats',
    raw = 'raw',
}

/**
 *
 */
export interface MinerFeatureProperties {
    /**
     *
     */
    category: MinerFeatureCategory;
    /**
     *
     */
    id: string;
    /**
     *
     */
    label: string;
    /**
     *
     */
    description: string;
    /**
     *
     */
    type: string;
    /**
     *
     */
    unit?: string;
    /**
     *
     */
    readable?: boolean;
    /**
     *
     */
    writable?: boolean;

    // whether this feature is considered advanced. could be used to f.e. hide it in the UI by default
    // (f.e. sets the "expert" flag in ioBroker)
    /**
     *
     */
    advanced?: boolean;
}

export const minerFeatures: Record<MinerFeatureKey, MinerFeatureProperties> = {
    /*
       control
    */
    [MinerFeatureKey.running]: {
        category: MinerFeatureCategory.control,
        id: 'running',
        label: 'Running',
        description: 'Whether the miner is running.',
        type: 'boolean',
        readable: true,
        writable: true,
    },

    /*
        info – identity / config / firmware / connection meta
     */
    [MinerFeatureKey.version]: {
        category: MinerFeatureCategory.info,
        id: 'version',
        label: 'Miner Version',
        description: 'The version of the miner software.',
        type: 'string',
        readable: true,
        writable: false,
    },

    /*
        stats – live performance metrics
     */
    [MinerFeatureKey.totalHashrate]: {
        category: MinerFeatureCategory.stats,
        id: 'totalHashrate',
        label: 'Total Hashrate',
        description: 'The total hashrate of the miner.',
        type: 'number',
        unit: 'h/s',
        readable: true,
        writable: false,
    },

    /*
        raw – raw API payloads (expert)
     */
    [MinerFeatureKey.rawStats]: {
        category: MinerFeatureCategory.raw,
        id: 'stats',
        label: 'RAW Miner Stats',
        description: 'Raw info returned by the miner.',
        type: 'object',
        readable: true,
        writable: false,
        advanced: true,
    },
} as const;

/**
 *
 */
export function getMinerFeatureFullId(key: MinerFeatureKey): string {
    return `${minerFeatures[key].category}.${minerFeatures[key].id}`;
}
