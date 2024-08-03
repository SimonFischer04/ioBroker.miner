import {SGMinerSettings} from '../model/MinerSettings';
import {PollingMiner} from './PollingMiner';
import {MinerStats} from '../model/MinerStats';
import { MinerFeatureKey } from '../model/MinerFeature';

export class SGMiner extends PollingMiner<SGMinerSettings> {
    public override init(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    public override start(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public override fetchStats(): Promise<MinerStats> {
        throw new Error('Method not implemented.');
    }

    public override stop(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public getSupportedFeatures(): MinerFeatureKey[] {
        throw new Error('Method not implemented.');
    }
}