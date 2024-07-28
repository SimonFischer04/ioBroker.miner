import {PollingMiner} from './PollingMiner';
import {TeamRedMinerSettings} from '../model/MinerSettings';
import {ClaymoreMiner} from './ClaymoreMiner';
import {SGMiner} from './SGMiner';

export class TeamRedMiner extends PollingMiner<TeamRedMinerSettings> {
    // TODO: actually does not support full claymore api
    // TODO: sgminer api

    private readonly claymoreMiner: ClaymoreMiner
    private readonly sgMiner: SGMiner;

    constructor(settings: TeamRedMinerSettings) {
        super(settings);

        this.claymoreMiner = new ClaymoreMiner(settings.claymore);
        this.sgMiner = new SGMiner(settings.sg);
    }

    public async connect(): Promise<void> {
        await this.claymoreMiner.connect();
    }

    public async start(): Promise<void> {
        await this.claymoreMiner.start();
    }

    public async fetchData(): Promise<void> {
        await this.claymoreMiner.fetchData();
    }

    public async stop(): Promise<void> {
        await this.claymoreMiner.stop();
    }

    public async close(): Promise<void> {
        await this.claymoreMiner.close();
    }
}