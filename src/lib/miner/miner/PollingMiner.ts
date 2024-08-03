import {Miner} from './Miner';
import {PollingMinerSettings} from '../model/MinerSettings';
import {asyncInterval, AsyncIntervalReturnType} from '../../utils/delay';
import {MinerStats} from '../model/MinerStats';

export abstract class PollingMiner<S extends PollingMinerSettings> extends Miner<S> {
    private pollInterval: AsyncIntervalReturnType | undefined;

    public abstract fetchStats(): Promise<MinerStats>;

    public override async init(): Promise<void> {
        this.logger.info(`initializing with interval ${this.settings.pollInterval}`);

        if (!this.settings.pollInterval || this.settings.pollInterval < 100) {
            this.logger.error(`pollInterval >= 100 required. got: ${this.settings.pollInterval}`);
            return;
        }

        // start polling
        this.pollInterval = asyncInterval(async () => {
            this.logger.debug('next poll interval time reached. calling fetchData()');
            try {
                const stats: MinerStats = await this.fetchStats();
                await this.onStats(stats);
            } catch (e) {
                this.logger.error(`fetchStats failed: ${e}`);
            }
        }, this.settings.pollInterval, true);
    }

    public override async close(): Promise<void> {
        await super.close();
        this.pollInterval?.clear();
    }

    public override getLoggerName(): string {
        return `${super.getLoggerName()}PollingMiner[${this.settings.pollInterval}]`;
    }
}