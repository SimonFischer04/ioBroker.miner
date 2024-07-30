export const minerTypeKeys = [
    'teamRedMiner',
    'claymoreMiner',
    'sgMiner'
]

export type MinerType = (typeof minerTypeKeys)[number];

export interface MinerSettings {
    // id to uniquely identify this miner
    id?: string;

    minerType: MinerType;
}

export interface PollingMinerSettings extends MinerSettings {
    pollInterval: number;
}

export interface TeamRedMinerSettings extends MinerSettings {
    minerType: (typeof minerTypeKeys)[0];
    claymore: ClaymoreMinerSettings;
    sg: SGMinerSettings;
}

export interface ClaymoreMinerSettings extends PollingMinerSettings {
    minerType: (typeof minerTypeKeys)[1];
    host: string;
    port: number;
    password: string;
}

export interface SGMinerSettings extends PollingMinerSettings {
    minerType: (typeof minerTypeKeys)[2];
    host: string;
    port: number;
}