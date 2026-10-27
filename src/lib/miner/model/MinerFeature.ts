export enum MinerFeatureKey {
    // control
    running = 'running',
    reboot = 'reboot',
    profile = 'profile',
    powerTarget = 'powerTarget',

    // info
    version = 'version',
    firmwareVersion = 'firmwareVersion',

    // info – update check (see Miner.checkForUpdate)
    latestVersion = 'latestVersion',
    updateAvailable = 'updateAvailable',
    autoUpgrade = 'autoUpgrade',
    autoUpgradeNextRun = 'autoUpgradeNextRun',

    // stats – indicates the miner provides live performance metrics
    stats = 'stats',

    // raw
    rawStats = 'rawStats',

    // info – CLI arguments needed for the miner to expose its API
    cliArgs = 'cliArgs',
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

    /**
     * TODO: how to handle this when moving to lib
     * ioBroker state role (e.g. 'button', 'indicator.reachable', 'value', 'switch').
     */
    role?: string;

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
        role: 'switch',
        readable: true,
        writable: true,
    },
    [MinerFeatureKey.reboot]: {
        category: MinerFeatureCategory.control,
        id: 'reboot',
        label: 'Reboot',
        description: 'Trigger a device reboot.',
        type: 'boolean',
        role: 'button',
        readable: false,
        writable: true,
    },
    [MinerFeatureKey.profile]: {
        category: MinerFeatureCategory.control,
        id: 'profile',
        label: 'Profile',
        description: 'Active performance profile of the miner.',
        type: 'string',
        role: 'text',
        readable: true,
        writable: true,
    },
    [MinerFeatureKey.powerTarget]: {
        category: MinerFeatureCategory.control,
        id: 'powerTarget',
        label: 'Power Target',
        description: 'Configured power target of the miner.',
        type: 'number',
        unit: 'W',
        role: 'level.power',
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

    [MinerFeatureKey.firmwareVersion]: {
        category: MinerFeatureCategory.info,
        id: 'firmwareVersion',
        label: 'Firmware Version',
        description: 'The firmware version of the miner hardware.',
        type: 'string',
        role: 'info.firmware',
        readable: true,
        writable: false,
    },

    /*
        info – update check: latest upstream version and whether it's newer than the installed one
     */
    [MinerFeatureKey.latestVersion]: {
        category: MinerFeatureCategory.info,
        id: 'latestVersion',
        label: 'Latest Version',
        description: 'Latest firmware/software version available for this miner.',
        type: 'string',
        role: 'text',
        readable: true,
        writable: false,
    },
    [MinerFeatureKey.updateAvailable]: {
        category: MinerFeatureCategory.info,
        id: 'updateAvailable',
        label: 'Update Available',
        description: 'Whether a newer version is available. Empty if unknown.',
        type: 'boolean',
        role: 'indicator',
        readable: true,
        writable: false,
    },
    [MinerFeatureKey.autoUpgrade]: {
        category: MinerFeatureCategory.info,
        id: 'autoUpgrade',
        label: 'Auto-Upgrade',
        description: 'Whether the miner installs firmware upgrades automatically.',
        type: 'boolean',
        role: 'indicator',
        readable: true,
        writable: false,
    },
    [MinerFeatureKey.autoUpgradeNextRun]: {
        category: MinerFeatureCategory.info,
        id: 'autoUpgradeNextRun',
        label: 'Next Auto-Upgrade',
        description: 'Next scheduled automatic upgrade run.',
        type: 'number',
        role: 'date',
        readable: true,
        writable: false,
    },

    /*
        info – CLI arguments
     */
    [MinerFeatureKey.cliArgs]: {
        category: MinerFeatureCategory.info,
        id: 'cliArgs',
        label: 'CLI Arguments',
        description: 'Command line arguments needed to enable API access on the miner.',
        type: 'string',
        readable: true,
        writable: false,
    },

    /*
        stats – live performance metrics.
        When a miner declares this feature it will get all stats sub-states
        (totalHashrate, power, efficiency, acceptedShares, rejectedShares).
        The miner fills whatever values it can in MinerStats.
     */
    [MinerFeatureKey.stats]: {
        category: MinerFeatureCategory.stats,
        id: 'stats',
        label: 'Statistics',
        description: 'Live performance metrics are available.',
        type: 'mixed',
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
 * @param key - the miner feature key to get the full id for
 */
export function getMinerFeatureFullId(key: MinerFeatureKey): string {
    return `${minerFeatures[key].category}.${minerFeatures[key].id}`;
}
