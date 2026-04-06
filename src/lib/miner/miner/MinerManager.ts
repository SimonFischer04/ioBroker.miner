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
     * @param settings - the miner configuration to initialize
     */
    public async init(settings: MinerSettings): Promise<Miner<MinerSettings>> {
        logger.info(`[init] initializing miner with id ${settings.id}`);

        const miner: Miner<MinerSettings> = createMiner(settings);
        this.miners.push(miner);
        await miner.init();
        return miner;
    }

    /**
     *
     * @param id - the miner id to close
     */
    public async close(id: string): Promise<void> {
        logger.info(`[close] unloading miner with id ${id}`);

        if (id == null) {
            logger.error('[close] id must be provided');
            return;
        }

        const miner = this.getMinerById(id);
        if (!miner) {
            logger.error(`[close] miner with id ${id} not found`);
            return;
        }

        await miner.close();
        this.miners.splice(this.miners.indexOf(miner), 1);
    }

    /**
     *
     */
    public async closeAll(): Promise<void> {
        logger.log('[closeAll] unloading all miners');

        for (const miner of this.miners) {
            await miner.close();
        }
        this.miners.splice(0, this.miners.length);
    }

    /**
     *
     * @param id - the miner id to look up
     */
    private getMinerById(id: string): Miner<MinerSettings> | undefined {
        return this.miners.find(miner => miner.settings.id === id);
    }

    /**
     *
     * @param id - the miner id to check
     */
    public hasMiner(id: string): boolean {
        return this.getMinerById(id) != null;
    }

    /**
     *
     * @param id - the miner id to start
     */
    public async startMiner(id: string): Promise<void> {
        logger.info(`[startMiner] starting miner with id ${id}`);

        const miner = this.getMinerById(id);
        if (!miner) {
            logger.warn(`[startMiner] miner with id ${id} not found`);
            return;
        }

        await miner.start();
    }

    /**
     *
     * @param id - the miner id to stop
     */
    public async stopMiner(id: string): Promise<void> {
        logger.info(`[stopMiner] stopping miner with id ${id}`);

        const miner = this.getMinerById(id);
        if (!miner) {
            logger.warn(`[stopMiner] miner with id ${id} not found`);
            return;
        }

        await miner.stop();
    }

    /**
     * Set the active performance profile on a miner.
     *
     * @param id - the miner id
     * @param profile - the profile name to activate
     */
    public async setProfile(id: string, profile: string): Promise<void> {
        logger.info(`[setProfile] setting profile "${profile}" on miner with id ${id}`);

        const miner = this.getMinerById(id);
        if (!miner) {
            logger.warn(`[setProfile] miner with id ${id} not found`);
            return;
        }

        await miner.setProfile(profile);
    }
}
