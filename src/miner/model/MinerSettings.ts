export const minerTypeKeys = [
    'teamRedMiner',
    'claymoreMiner',
    'sgMiner'
]

export type MinerType = (typeof minerTypeKeys)[number];

export interface MinerSettings {
    minerType: MinerType;
}

export interface TeamRedMinerSettings {
    minerType: (typeof minerTypeKeys)[0];
    claymore: ClaymoreMinerSettings;
    sg: SGMinerSettings;
}

export interface ClaymoreMinerSettings {
    minerType: (typeof minerTypeKeys)[1];
    host: string;
    port: number;
    password: string;
}

export interface SGMinerSettings {
    minerType: (typeof minerTypeKeys)[2];
    host: string;
    port: number;
}