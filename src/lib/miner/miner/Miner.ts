import type { MinerSettings } from '../model/MinerSettings';
import * as crypto from 'node:crypto';
import { MinerFeatureKey } from '../model/MinerFeature';
import { Logger } from '../model/Logger';
import type { MinerStats } from '../model/MinerStats';
import type { UpdateCheckResult } from '../model/UpdateCheckResult';
import type { UpdateSources } from '../../update/UpdateSources';

/**
 *
 */
export abstract class Miner<S extends MinerSettings> {
    protected logger: Logger;
    private statSubscriptions: ((stats: MinerStats) => Promise<void>)[] = [];
    private onlineStatusSubscriptions: ((online: boolean) => Promise<void>)[] = [];

    /**
     *
     * @param settings - miner-specific configuration
     */
    constructor(public readonly settings: S) {
        if (settings == null) {
            // can't use usual logger because settings are missing
            this.logger = Logger.getLogger('Miner[null]');
            this.logger.error('Miner settings must be provided. This should never happen!');
            return;
        }

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
     * Get available performance profiles for this miner.
     * Returns an empty array if profiles are not supported.
     */
    public getProfiles(): string[] {
        return [];
    }

    /**
     * Set the active performance profile.
     *
     * @param _profile - the profile name to activate
     */
    public setProfile(_profile: string): Promise<void> {
        this.logger.error('setProfile() not implemented for this miner');
        return Promise.resolve();
    }

    /**
     * Look up whether a newer firmware/software version is available for this miner.
     * Miners that support it override this and declare {@link MinerFeatureKey.updateAvailable}
     * and {@link MinerFeatureKey.latestVersion}.
     *
     * @param _sources - shared, cached lookups of the upstream sources
     */
    public checkForUpdate(_sources: UpdateSources): Promise<UpdateCheckResult> {
        return Promise.reject(new Error('update check is not supported for this miner type'));
    }

    /**
     * The feature whose state holds the version {@link checkForUpdate} compares, shown next to the latest version.
     */
    public getInstalledVersionFeature(): MinerFeatureKey.version | MinerFeatureKey.firmwareVersion {
        return MinerFeatureKey.version;
    }

    /**
     * Set the active power target in watts.
     *
     * @param _powerTarget - the target power in watts
     */
    public setPowerTarget(_powerTarget: number): Promise<void> {
        this.logger.error('setPowerTarget() not implemented for this miner');
        return Promise.resolve();
    }

    /**
     * Close / cleanup any open resources
     */
    public close(): Promise<void> {
        this.statSubscriptions = [];
        this.onlineStatusSubscriptions = [];
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
     * Subscribe to changes of whether the miner is reachable
     *
     * @param callback - callback that gets called with the new status whenever it changes
     */
    public subscribeToOnlineStatus(callback: (online: boolean) => Promise<void>): void {
        this.onlineStatusSubscriptions.push(callback);
    }

    /**
     * Called by the miner when it becomes reachable or unreachable.
     * Subscribers will be notified.
     *
     * @param online - whether the miner is reachable now
     */
    public async onOnlineStatus(online: boolean): Promise<void> {
        this.logger.debug(`publishing online status to subscribers: ${online}`);
        for (const sub of this.onlineStatusSubscriptions) {
            await sub(online);
        }
    }

    /**
     * Get the command line arguments required to append to the miner start command for this adapter to be able to connect to the miner / communicate with it
     */
    public abstract getCliArgs(): string[];
}
