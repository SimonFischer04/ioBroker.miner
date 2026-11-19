import { Miner } from './Miner';
import type { PollingMinerSettings } from '../model/MinerSettings';
import { BackoffPoller, getPollTimeoutMs } from '../../utils/backoff-poller';
import type { MinerStats } from '../model/MinerStats';

/**
 * Upper limit for the time between polls while a miner keeps failing, however long its pollInterval is.
 */
const MAX_POLL_BACKOFF_MS = 5 * 60 * 1000;

/**
 *
 */
export abstract class PollingMiner<S extends PollingMinerSettings> extends Miner<S> {
    private poller: BackoffPoller<MinerStats> | undefined;

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

        this.poller = new BackoffPoller<MinerStats>({
            subject: 'miner',
            logger: this.logger,
            pollIntervalMs: this.settings.pollInterval,
            maxBackoffMs: MAX_POLL_BACKOFF_MS,
            // a poll that hangs (e.g. a connection that is never answered) has to count as failed, or the miner would
            // never be reported offline
            pollTimeoutMs: this.getPollTimeoutMs(),
            fetch: () => this.fetchStats(),
            publishStats: stats => this.onStats(stats),
            publishOnlineStatus: online => this.onOnlineStatus(online),
        });
        this.poller.start();

        return Promise.resolve();
    }

    /**
     * How long a single poll may take before it counts as failed. Miners also use it as the timeout of the requests a
     * poll makes, so that a request abandoned by a timed-out poll doesn't linger.
     */
    protected getPollTimeoutMs(): number {
        return getPollTimeoutMs(this.settings.pollInterval);
    }

    /**
     * Stop polling. Once this has resolved, no subscriber is running or will be called again: statistics that are
     * being published right now are waited for, a poll still fetching is discarded.
     */
    public override async close(): Promise<void> {
        await this.poller?.stop();
        this.poller = undefined;
        await super.close();
    }

    /**
     *
     */
    public override getLoggerName(): string {
        return `${super.getLoggerName()}PollingMiner[${this.settings.pollInterval}]`;
    }
}
