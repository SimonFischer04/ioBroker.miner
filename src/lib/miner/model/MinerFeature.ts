export enum MinerFeatureKey {
    running = 'running',
    rawStats = 'rawStats',
    version = 'version',
    totalHashrate = 'totalHashrate'
}

export enum MinerFeatureCategory {
    control = 'control',
    info = 'info'
}

export interface MinerFeatureProperties {
    category: MinerFeatureCategory,
    id: string;
    label: string;
    description: string;
    type: string;
    unit?: string;
    readable?: boolean;
    writable?: boolean;

    // whether this feature is considered advanced. could be used to f.e. hide it in the UI by default
    // (f.e. sets the "expert" flag in ioBroker)
    advanced?: boolean;
}

export const minerFeatures: Record<MinerFeatureKey, MinerFeatureProperties> = {
    /*
       controls
    */
    [MinerFeatureKey.running]: {
        category: MinerFeatureCategory.control,
        id: 'MINER_RUNNING',
        label: 'Running',
        description: 'Whether the miner is running.',
        type: 'boolean',
        readable: true,
        writable: true
    },

    /*
        info
     */
    [MinerFeatureKey.rawStats]: {
        category: MinerFeatureCategory.info,
        id: 'RAW',
        label: 'RAW Miner Stats',
        description: 'Raw info returned by the miner.',
        type: 'object',
        readable: true,
        writable: false,
        advanced: true
    },

    [MinerFeatureKey.version]: {
        category: MinerFeatureCategory.info,
        id: 'VERSION',
        label: 'Miner Version',
        description: 'The version of the miner software.',
        type: 'string',
        readable: true,
        writable: false
    },

    [MinerFeatureKey.totalHashrate]: {
        category: MinerFeatureCategory.info,
        id: 'TOTAL_HASHRATE',
        label: 'Total Hashrate',
        description: 'The total hashrate of the miner.',
        type: 'number',
        unit: 'h/s',
        readable: true,
        writable: false
    }
} as const;

export function getMinerFeatureFullId(key: MinerFeatureKey): string{
    return `${minerFeatures[key].category}.${minerFeatures[key].id}`;
}