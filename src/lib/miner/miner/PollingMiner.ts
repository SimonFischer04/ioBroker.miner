import { Miner } from './Miner';
import type { PollingMinerSettings } from '../model/MinerSettings';
import type { AsyncIntervalReturnType } from '../../utils/delay';
import { asyncBackoffInterval } from '../../utils/delay';
import type { MinerStats } from '../model/MinerStats';

/**
 *
 */
export abstract class PollingMiner<S extends PollingMinerSettings> extends Miner<S> {
    private pollHandle: AsyncIntervalReturnType | undefined;

    public abstract fetchStats(): Promise<MinerStats>;

    /**
     *
     */
    public override init(): Promise<void> {
        this.logger.info(`initializing with interval ${this.settings.pollInterval}`);

        if (!this.settings.pollInterval || this.settings.pollInterval < 100) {
            this.logger.error(`pollInterval >= 100 required. got: ${this.settings.pollInterval}`);
            return Promise.resolve();
        }

        // start polling, backing off exponentially while polls keep failing
        this.pollHandle = asyncBackoffInterval(
            async () => {
                this.logger.debug('next poll interval time reached. calling fetchData()');
                const stats: MinerStats = await this.fetchStats();
                await this.onStats(stats);
            },
            this.settings.pollInterval,
            {
                shouldExecuteImmediately: true,
                onError: (e, consecutiveFailures, nextDelayMs) => {
                    this.logger.error(
                        `fetchStats failed (failure #${consecutiveFailures}, next retry in ${nextDelayMs}ms): ${String(e)}`,
                    );
                },
            },
        );

        return Promise.resolve();
    }

    /**
     *
     */
    public override async close(): Promise<void> {
        await super.close();
        this.pollHandle?.clear();
    }

    /**
     *
     */
    public override getLoggerName(): string {
        return `${super.getLoggerName()}PollingMiner[${this.settings.pollInterval}]`;
    }
}
