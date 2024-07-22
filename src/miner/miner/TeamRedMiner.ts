import {PollingMiner} from './PollingMiner';
import {TeamRedMinerSettings} from '../model/MinerSettings';

export class TeamRedMiner extends PollingMiner<TeamRedMinerSettings> {
    // TODO: actually does not support full claymore api
    // TODO: sgminer api

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