import {Miner} from './Miner';
import {MinerSettings} from '../model/MinerSettings';

export class MinerManager {
    private readonly miners: Miner<MinerSettings>[] = [];

    public async close(): Promise<void> {
        for (const miner of this.miners) {
            await miner.close();
        }
    }
}