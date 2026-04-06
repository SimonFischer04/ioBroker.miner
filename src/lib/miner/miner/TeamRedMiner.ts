import { PollingMiner } from './PollingMiner';
import type { TeamRedMinerSettings } from '../model/MinerSettings';
import { ClaymoreMiner } from './ClaymoreMiner';
import { CGMiner } from './CGMiner';
import type { MinerStats } from '../model/MinerStats';
import type { MinerFeatureKey } from '../model/MinerFeature';
import { distinct } from '../../utils/array-utils';

/**
 *
 */
export class TeamRedMiner extends PollingMiner<TeamRedMinerSettings> {
    private readonly claymoreMiner: ClaymoreMiner;
    private readonly cgMiner: CGMiner;

    /**
     *
     * @param settings - TeamRedMiner-specific configuration
     */
    constructor(settings: TeamRedMinerSettings) {
        super(settings);

        if (
            settings.pollInterval !== settings.cgminer?.pollInterval ||
            settings.pollInterval !== settings.claymore?.pollInterval
        ) {
            this.logger.error('pollInterval must be the same for all miners');
        }

        this.claymoreMiner = new ClaymoreMiner(settings.claymore);
        this.cgMiner = new CGMiner(settings.cgminer);
    }

    /**
     *
     */
    public override async init(): Promise<void> {
        await super.init();

        // DO NOT CALL sub-miner.init() here, as it will init the polling interval, but trm is PollingMiner itself (own interval) => calls fetchData() for both miners itself and merges the results
        // await this.claymoreMiner.init();
        // await this.cgMiner.init();
    }

    /**
     *
     */
    public override async start(): Promise<void> {
        await this.claymoreMiner.start();
    }

    /**
     *
     */
    public override async fetchStats(): Promise<MinerStats> {
        const claymoreStats: MinerStats = await this.claymoreMiner.fetchStats();
        const cgStats: MinerStats = await this.cgMiner.fetchStats();

        return {
            raw: {
                claymore: claymoreStats.raw,
                cgminer: cgStats.raw,
            },
            version: claymoreStats.version,
            totalHashrate: claymoreStats.totalHashrate,
        };
    }

    /**
     *
     */
    public override async stop(): Promise<void> {
        await this.claymoreMiner.stop();
    }

    /**
     *
     */
    public override async close(): Promise<void> {
        await this.claymoreMiner.close();
    }

    /**
     *
     */
    public override getSupportedFeatures(): MinerFeatureKey[] {
        return distinct([...this.claymoreMiner.getSupportedFeatures(), ...this.cgMiner.getSupportedFeatures()]);
    }

    /**
     *
     */
    public override getCliArgs(): string[] {
        return [
            ...this.claymoreMiner.getCliArgs(),
            // cgminer official syntax is '--api-listen', but teamRedMiner uses '--api_listen'
            ...this.cgMiner.getCliArgs().map(arg => arg.replace('--api-listen', '--api_listen')),
        ];
    }
}
