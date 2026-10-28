import { Miner } from './Miner';
import type { PollingMinerSettings } from '../model/MinerSettings';
import type { AsyncIntervalReturnType } from '../../utils/delay';
import { asyncBackoffInterval, withTimeout } from '../../utils/delay';
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
 * Failed polls in a row after which the miner is reported offline. A single failure is usually just a network hiccup.
 */
const OFFLINE_AFTER_FAILURES = 3;

/**
 * Lower limit for the time a single poll may take before it counts as failed. With a longer pollInterval, a poll
 * may take as long as pollInterval.
 */
const MIN_POLL_TIMEOUT_MS = 30_000;

/**
 *
 */
export abstract class PollingMiner<S extends PollingMinerSettings> extends Miner<S> {
    private pollHandle: AsyncIntervalReturnType | undefined;
    private online: boolean | undefined;

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

        // a poll that hangs (e.g. a connection that is never answered) has to count as failed, or the miner would never
        // be reported offline
        const pollTimeoutMs = this.getPollTimeoutMs();

        // start polling, backing off exponentially while polls keep failing
        this.pollHandle = asyncBackoffInterval(
            async () => {
                this.logger.debug('next poll interval time reached. calling fetchData()');
                const stats: MinerStats = await withTimeout(
                    this.fetchStats(),
                    pollTimeoutMs,
                    `fetchStats did not finish within ${pollTimeoutMs}ms`,
                );
                await this.setOnline(true);
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
                    if (consecutiveFailures >= OFFLINE_AFTER_FAILURES) {
                        void this.setOnline(false);
                    }
                },
            },
        );

        return Promise.resolve();
    }

    /**
     * How long a single poll may take before it counts as failed. Miners also use it as the timeout of the requests a
     * poll makes, so that a request abandoned by a timed-out poll doesn't linger.
     */
    protected getPollTimeoutMs(): number {
        return Math.max(this.settings.pollInterval, MIN_POLL_TIMEOUT_MS);
    }

    /**
     * Report a change of the online status to subscribers. Repeating the current status does nothing.
     *
     * @param online - whether the last poll(s) reached the miner
     */
    private async setOnline(online: boolean): Promise<void> {
        if (this.online === online) {
            return;
        }
        this.online = online;

        if (!online) {
            this.logger.warn(`${OFFLINE_AFTER_FAILURES} polls in a row failed, reporting the miner as offline`);
        }
        try {
            await this.onOnlineStatus(online);
        } catch (e) {
            this.logger.error(`could not publish online status ${online}: ${String(e)}`);
        }
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
