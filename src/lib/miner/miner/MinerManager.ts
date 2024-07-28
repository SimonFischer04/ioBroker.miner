import {Miner} from './Miner';
import {MinerSettings} from '../model/MinerSettings';
import {createMiner} from './MinerFactory';

export class MinerManager {
    private readonly miners: Miner<MinerSettings>[] = [];

    public async init(settings: MinerSettings): Promise<Miner<MinerSettings>> {
        const miner: Miner<MinerSettings> = createMiner(settings);
        this.miners.push(miner);
        await miner.connect();
        return miner;
    }

    public async close(): Promise<void> {
        for (const miner of this.miners) {
            await miner.close();
        }
    }
}