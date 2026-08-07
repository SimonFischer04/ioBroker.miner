import { Miner } from './Miner';
import type { PollingMinerSettings } from '../model/MinerSettings';
import type { AsyncIntervalReturnType } from '../../utils/delay';
import { delay } from '../../utils/delay';
import type { MinerStats } from '../model/MinerStats';

/** Maximum backoff multiplier (interval * 2^MAX_BACKOFF_EXPONENT is the ceiling). */
const MAX_BACKOFF_EXPONENT = 5; // max 32x the base interval

/**
 *
 */
export abstract class PollingMiner<S extends PollingMinerSettings> extends Miner<S> {
    private pollHandle: AsyncIntervalReturnType | undefined;
    private consecutiveFailures = 0;

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

        // start polling with exponential backoff on failure
        let stopped = false;

        const poll = async (): Promise<void> => {
            while (!stopped) {
                this.logger.debug('next poll interval time reached. calling fetchData()');
                try {
                    const stats: MinerStats = await this.fetchStats();
                    await this.onStats(stats);
                    this.consecutiveFailures = 0;
                } catch (e) {
                    this.consecutiveFailures++;
                    this.logger.error(`fetchStats failed: ${String(e)}`);
                }

                const backoffExponent = Math.min(this.consecutiveFailures, MAX_BACKOFF_EXPONENT);
                const nextDelay = this.settings.pollInterval * Math.pow(2, backoffExponent);
                if (this.consecutiveFailures > 0) {
                    this.logger.debug(
                        `backing off: next retry in ${nextDelay}ms (failure #${this.consecutiveFailures})`,
                    );
                }
                await delay(nextDelay);
            }
        };

        void poll();

        this.pollHandle = {
            clear: (): void => {
                stopped = true;
            },
        };

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
