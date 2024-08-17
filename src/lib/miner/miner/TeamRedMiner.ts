import {PollingMiner} from './PollingMiner';
import {TeamRedMinerSettings} from '../model/MinerSettings';
import {ClaymoreMiner} from './ClaymoreMiner';
import {SGMiner} from './SGMiner';
import {MinerStats} from '../model/MinerStats';
import {MinerFeatureKey} from '../model/MinerFeature';

export class TeamRedMiner extends PollingMiner<TeamRedMinerSettings> {
    // TODO: actually does not support full claymore api
    // TODO: sgminer api

    private readonly claymoreMiner: ClaymoreMiner
    private readonly sgMiner: SGMiner;

    constructor(settings: TeamRedMinerSettings) {
        super(settings);

        if (settings.pollInterval !== settings.sg.pollInterval || settings.pollInterval !== settings.claymore.pollInterval) {
            throw new Error('pollInterval must be the same for all miners');
        }

        this.claymoreMiner = new ClaymoreMiner(settings.claymore);
        this.sgMiner = new SGMiner(settings.sg);
    }

    public override async init(): Promise<void> {
        await super.init();

        // DO NOT CALL sub-miner.init() here, as it will init the polling interval, but trm is PollingMiner itself (own interval) => calls fetchData() for both miners itself and merges the results
        // await this.claymoreMiner.init();
    }

    public override async start(): Promise<void> {
        await this.claymoreMiner.start();
    }

    public override async fetchStats(): Promise<MinerStats> {
        const claymoreStats: MinerStats = await this.claymoreMiner.fetchStats();
        // await this.sgMiner.fetchData()
        return claymoreStats;
    }

    public override async stop(): Promise<void> {
        await this.claymoreMiner.stop();
    }

    public override async close(): Promise<void> {
        await this.claymoreMiner.close();
    }

    public getSupportedFeatures(): MinerFeatureKey[] {
        return [
            ...this.claymoreMiner.getSupportedFeatures()
        ]
    }

    public getCliArgs(): string[] {
        return [
            ...this.claymoreMiner.getCliArgs()
        ]
    }
}