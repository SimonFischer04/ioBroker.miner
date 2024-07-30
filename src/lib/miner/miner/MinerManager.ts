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

    private getMinerById(id: string): Miner<MinerSettings> | undefined {
        return this.miners.find(miner => miner.settings.id === id);
    }

    public async startMiner(id: string): Promise<void> {
        const miner = this.getMinerById(id);
        if (!miner) {
            throw new Error(`miner with id ${id} not found`);
        }

        await miner.start();
    }

    public async stopMiner(id: string): Promise<void> {
        const miner = this.getMinerById(id);
        if (!miner) {
            throw new Error(`miner with id ${id} not found`);
        }

        await miner.stop();
    }
}