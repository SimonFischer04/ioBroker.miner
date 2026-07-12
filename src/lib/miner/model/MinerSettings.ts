export const minerTypeKeys = [
    'teamRedMiner',
    'claymoreMiner',
    'cgMiner',
    'xmRig',
    'iceRiverOcMiner',
    'bosMiner',
    'bos',
    'avalonMiner',
];

// TODO: move to miner class
export const BOS_DEFAULT_USERNAME = 'root';
export const BOS_DEFAULT_PASSWORD = '';

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
// TODO: own settings. -> allow to cleanup anc move f.e. port into pollingMiner (or even base miner)
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
    cgminer: CGMinerSettings;
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
 * Common settings for miners communicating via the CGMiner-compatible socket API.
 */
export interface CGMinerSettings extends PollingMinerSettings {
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
export interface BOSMinerSettings extends CGMinerSettings {
    /**
     *
     */
    minerType: (typeof minerTypeKeys)[5];
    /**
     * SSH port used for legacy config-file workarounds.
     */
    sshPort: number;
    /**
     *
     */
    username: string;
    /**
     *
     */
    password: string;
}

/**
 *
 */
export interface BOSSettings extends PollingMinerSettings {
    /**
     *
     */
    minerType: (typeof minerTypeKeys)[6];
    /**
     *
     */
    port: number;
    /**
     *
     */
    username: string;
    /**
     *
     */
    password: string;
    /**
     * Whether to use TLS for the gRPC connection.
     */
    secure?: boolean;
    /**
     * Per-request timeout in milliseconds.
     */
    timeoutMs?: number;
}

/**
 *
 */
export interface AvalonMinerSettings extends CGMinerSettings {
    /**
     *
     */
    minerType: (typeof minerTypeKeys)[7];
}
