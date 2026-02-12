import type { MinerSettings } from '../model/MinerSettings';
import * as crypto from 'node:crypto';
import type { MinerFeatureKey } from '../model/MinerFeature';
import { Logger } from '../model/Logger';
import type { MinerStats } from '../model/MinerStats';

/**
 *
 */
export abstract class Miner<S extends MinerSettings> {
    protected logger: Logger;
    private statSubscriptions: ((stats: MinerStats) => Promise<void>)[] = [];

    /**
     *
     */
    constructor(public readonly settings: S) {
        if (!settings.id) {
            this.settings.id = crypto.randomUUID();
        }
        this.logger = Logger.getLogger(this.getLoggerName());
    }

    /**
     * Get the features supported by this miner
     */
    public abstract getSupportedFeatures(): MinerFeatureKey[];

    /**
     * Initialize the miner: connect, start polling (for polling miners, ...), ...
     */
    public abstract init(): Promise<void>;

    /**
     * Start mining
     */
    public abstract start(): Promise<void>;

    /**
     * Stop mining
     */
    public abstract stop(): Promise<void>;

    /**
     * Close / cleanup any open resources
     */
    public close(): Promise<void> {
        this.statSubscriptions = [];
        return Promise.resolve();
    }

    /**
     * Get name to use for the logger
     */
    protected getLoggerName(): string {
        return `Miner[${this.settings.id}, ${this.settings.minerType}]`;
    }

    /**
     * Subscribe to miner stats
     *
     * @param callback - callback that gets called when new stats are available
     */
    public subscribeToStats(callback: (stats: MinerStats) => Promise<void>): void {
        this.statSubscriptions.push(callback);
    }

    /**
     * Called by the miner when new stats are available.
     * Subscribers will be notified.
     *
     * @param stats - the new stats
     */
    public async onStats(stats: MinerStats): Promise<void> {
        this.logger.debug(`publishing new stats to subscribers: ${JSON.stringify(stats)}`);
        for (const sub of this.statSubscriptions) {
            await sub(stats);
        }
    }

    /**
     * Get the command line arguments required to append to the miner start command for this adapter to be able to connect to the miner / communicate with it
     */
    public abstract getCliArgs(): string[];
}
