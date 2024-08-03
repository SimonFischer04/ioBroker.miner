export enum MinerFeatureKey {
    running = 'running',
    version = 'version',
    totalHashrate = 'totalHashrate'
}

export enum MinerFeatureCategory {
    control = 'control',
    info = 'info'
}

export const minerFeatures: Record<MinerFeatureKey, {
    category: MinerFeatureCategory,
    id: string;
    label: string;
    description: string;
    type: string;
    unit?: string;
    readable?: boolean;
    writable?: boolean;
}> = {
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
        unit: 'kh/s',
        readable: true,
        writable: false
    }
} as const;

export function getMinerFeatureFullId(key: MinerFeatureKey): string{
    return `${minerFeatures[key].category}.${minerFeatures[key].id}`;
}