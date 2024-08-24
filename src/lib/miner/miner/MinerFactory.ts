import {
    ClaymoreMinerSettings,
    MinerSettings,
    SGMinerSettings,
    TeamRedMinerSettings,
    XMRigSettings
} from '../model/MinerSettings';
import {Miner} from './Miner';
import {TeamRedMiner} from './TeamRedMiner';
import {ClaymoreMiner} from './ClaymoreMiner';
import {SGMiner} from './SGMiner';
import {XMRigMiner} from './XMRigMiner';

export function createMiner(settings: MinerSettings): Miner<MinerSettings> {
    switch (settings.minerType) {
        case 'teamRedMiner': {
            // TODO: improve type???
            return new TeamRedMiner(settings as TeamRedMinerSettings);
        }

        case 'claymoreMiner': {
            return new ClaymoreMiner(settings as ClaymoreMinerSettings);
        }

        case 'sgMiner': {
            return new SGMiner(settings as SGMinerSettings);
        }

        case 'xmRig': {
            return new XMRigMiner(settings as XMRigSettings);
        }

        default: {
            throw new Error(`createMiner minerType: ${settings.minerType} not supported yet`);
        }
    }
}