import type { Pool } from './Pool';
import type { PoolSettings } from '../model/PoolSettings';
import { createPool } from './PoolFactory';
import { Logger } from '../model/Logger';

const logger = Logger.getLogger('PoolManager');

/**
 * Keeps track of the initialized (polling) pool accounts.
 */
export class PoolManager {
    private readonly pools: Pool<PoolSettings>[] = [];

    /**
     * Create the pool for the given settings and start polling it.
     *
     * @param settings - the pool account configuration
     */
    public async init(settings: PoolSettings): Promise<Pool<PoolSettings>> {
        logger.info(`[init] initializing pool with id ${settings.id}`);

        const pool = createPool(settings);
        try {
            await pool.init();
        } catch (e) {
            await pool.close();
            throw e;
        }
        this.pools.push(pool);
        return pool;
    }

    /**
     * Stop polling the pool with the given id.
     *
     * @param id - the pool id
     */
    public async close(id: string): Promise<void> {
        logger.info(`[close] unloading pool with id ${id}`);

        const pool = this.getPool(id);
        if (!pool) {
            logger.error(`[close] pool with id ${id} not found`);
            return;
        }

        await pool.close();
        this.pools.splice(this.pools.indexOf(pool), 1);
    }

    /**
     * Stop polling all pools.
     */
    public async closeAll(): Promise<void> {
        for (const pool of this.pools) {
            await pool.close();
        }
        this.pools.splice(0, this.pools.length);
    }

    /**
     * The initialized pool with the given id, if any.
     *
     * @param id - the pool id
     */
    public getPool(id: string): Pool<PoolSettings> | undefined {
        return this.pools.find(pool => pool.settings.id === id);
    }

    /**
     * Whether a pool with the given id is initialized.
     *
     * @param id - the pool id
     */
    public hasPool(id: string): boolean {
        return this.getPool(id) !== undefined;
    }

    /**
     * All initialized pools (a copy).
     */
    public getPools(): Pool<PoolSettings>[] {
        return [...this.pools];
    }
}
