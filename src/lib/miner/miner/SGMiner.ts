import {SGMinerSettings} from '../model/MinerSettings';
import {PollingMiner} from './PollingMiner';

export class SGMiner extends PollingMiner<SGMinerSettings> {
    public override init(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public override start(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public override fetchData(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public override stop(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}