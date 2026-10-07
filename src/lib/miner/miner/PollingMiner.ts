import { Miner } from './Miner';
import type { PollingMinerSettings } from '../model/MinerSettings';
import type { AsyncIntervalReturnType } from '../../utils/delay';
import { asyncBackoffInterval } from '../../utils/delay';
import type { MinerStats } from '../model/MinerStats';

/**
 * Upper limit for the time between polls while a miner keeps failing, however long its pollInterval is.
 */
const MAX_POLL_BACKOFF_MS = 5 * 60 * 1000;

/**
 * Shorten each backoff delay randomly by up to 20 %, so miners behind the same outage don't all retry at once.
 */
const POLL_BACKOFF_JITTER = 0.2;

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
                maxDelayMs: MAX_POLL_BACKOFF_MS,
                jitter: POLL_BACKOFF_JITTER,
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
