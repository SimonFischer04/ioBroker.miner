import {SGMinerSettings} from '../model/MinerSettings';
import {PollingMiner} from './PollingMiner';

export class SGMiner extends PollingMiner<SGMinerSettings> {
    public connect(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public start(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public fetchData(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public stop(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public close(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}