export const minerTypeKeys = [
    'teamRedMiner',
    'claymoreMiner',
    'sgMiner'
]

export type MinerType = (typeof minerTypeKeys)[number];

export interface MinerSettings {
    minerType: MinerType;

    // id to uniquely identify this miner
    id?: string;

    host: string;
}

export interface PollingMinerSettings extends MinerSettings {
    pollInterval: number;
}

export interface TeamRedMinerSettings extends PollingMinerSettings {
    minerType: (typeof minerTypeKeys)[0];
    claymore: ClaymoreMinerSettings;
    sg: SGMinerSettings;
}

export interface ClaymoreMinerSettings extends PollingMinerSettings {
    minerType: (typeof minerTypeKeys)[1];
    port: number;
    password: string;
}

export interface SGMinerSettings extends PollingMinerSettings {
    minerType: (typeof minerTypeKeys)[2];
    port: number;
}