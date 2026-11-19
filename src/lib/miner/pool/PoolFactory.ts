import type { BraiinsPoolSettings, PoolSettings } from '../model/PoolSettings';
import type { Pool } from './Pool';
import { BraiinsPool } from './BraiinsPool';

/**
 * Create the pool implementation for the given settings.
 *
 * @param settings - the pool account configuration
 */
export function createPool(settings: PoolSettings): Pool<PoolSettings> {
    switch (settings.poolType) {
        case 'braiinsPool': {
            return new BraiinsPool(settings as BraiinsPoolSettings);
        }

        default: {
            throw new Error(`createPool poolType: ${String(settings.poolType)} not supported yet`);
        }
    }
}
