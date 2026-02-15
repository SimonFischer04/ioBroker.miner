export const minerTypeKeys = [
    'teamRedMiner',
    'claymoreMiner',
    'sgMiner',
    'xmRig',
    'iceRiverOcMiner',
    'bosMiner',
    'avalonMiner',
];

export type MinerType = (typeof minerTypeKeys)[number];

/**
 *
 */
export interface MinerSettings {
    /**
     *
     */
    minerType: MinerType;

    // id to uniquely identify this miner
    /**
     *
     */
    id?: string;

    /**
     *
     */
    host: string;
}

/**
 *
 */
export interface PollingMinerSettings extends MinerSettings {
    /**
     *
     */
    pollInterval: number;
}

/**
 *
 */
export interface TeamRedMinerSettings extends PollingMinerSettings {
    /**
     *
     */
    minerType: (typeof minerTypeKeys)[0];
    /**
     *
     */
    claymore: ClaymoreMinerSettings;
    /**
     *
     */
    sg: SGMinerSettings;
}

/**
 *
 */
export interface ClaymoreMinerSettings extends PollingMinerSettings {
    /**
     *
     */
    minerType: (typeof minerTypeKeys)[1];
    /**
     *
     */
    port: number;
    /**
     *
     */
    password: string;
}

/**
 *
 */
export interface SGMinerSettings extends PollingMinerSettings {
    /**
     *
     */
    minerType: (typeof minerTypeKeys)[2];
    /**
     *
     */
    port: number;
}

/**
 *
 */
export interface XMRigSettings extends PollingMinerSettings {
    /**
     *
     */
    minerType: (typeof minerTypeKeys)[3];
    /**
     *
     */
    port: number;
    /**
     *
     */
    password: string;
}

/**
 *
 */
export interface IceRiverOcMinerSettings extends PollingMinerSettings {
    /**
     *
     */
    minerType: (typeof minerTypeKeys)[4];
    /**
     *
     */
    port: number;
    /**
     *
     */
    password: string; // technically "api-token"
}

/**
 *
 */
export interface BOSMinerSettings extends PollingMinerSettings {
    /**
     *
     */
    minerType: (typeof minerTypeKeys)[5];
    /**
     *
     */
    port: number;
}

/**
 * Avalon Miner Settings (e.g., Canaan Avalon Q)
 */
export interface AvalonMinerSettings extends PollingMinerSettings {
    /**
     *
     */
    minerType: (typeof minerTypeKeys)[6];
    /**
     *
     */
    port: number;
}
