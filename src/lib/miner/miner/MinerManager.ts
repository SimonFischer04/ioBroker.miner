import type { Miner } from './Miner';
import type { MinerSettings } from '../model/MinerSettings';
import { createMiner } from './MinerFactory';
import { Logger } from '../model/Logger';

const logger = Logger.getLogger('MinerManager');

/**
 *
 */
export class MinerManager {
    private readonly miners: Miner<MinerSettings>[] = [];

    /**
     *
     */
    public async init(settings: MinerSettings): Promise<Miner<MinerSettings>> {
        logger.info(`initializing miner with id ${settings.id}`);

        const miner: Miner<MinerSettings> = createMiner(settings);
        this.miners.push(miner);
        await miner.init();
        return miner;
    }

    /**
     *
     */
    public async close(id: string): Promise<void> {
        logger.info(`unloading miner with id ${id}`);

        if (id == null) {
            logger.error('id must be provided');
            return;
        }

        const miner = this.getMinerById(id);
        if (!miner) {
            logger.error(`miner with id ${id} not found`);
            return;
        }

        await miner.close();
        this.miners.splice(this.miners.indexOf(miner), 1);
    }

    /**
     *
     */
    public async closeAll(): Promise<void> {
        logger.log('unloading all miners');

        for (const miner of this.miners) {
            await miner.close();
        }
        this.miners.splice(0, this.miners.length);
    }

    /**
     *
     */
    public getMinerById(id: string): Miner<MinerSettings> | undefined {
        return this.miners.find(miner => miner.settings.id === id);
    }

    /**
     *
     */
    public hasMiner(id: string): boolean {
        return this.getMinerById(id) != null;
    }

    /**
     *
     */
    public async startMiner(id: string): Promise<void> {
        logger.info(`starting miner with id ${id}`);

        const miner = this.getMinerById(id);
        if (!miner) {
            throw new Error(`miner with id ${id} not found`);
        }

        await miner.start();
    }

    /**
     *
     */
    public async stopMiner(id: string): Promise<void> {
        logger.info(`stopping miner with id ${id}`);

        const miner = this.getMinerById(id);
        if (!miner) {
            throw new Error(`miner with id ${id} not found`);
        }

        await miner.stop();
    }
}
