import type { SGMinerSettings } from '../model/MinerSettings';
import { PollingMiner } from './PollingMiner';
import type { MinerStats } from '../model/MinerStats';
import { MinerFeatureKey } from '../model/MinerFeature';
import { sendSocketCommand } from '../../utils/socket-utils';

// https://github.com/ckolivas/cgminer/blob/master/API-README
enum SGMinerCommand {
    summary = 'summary',
    coin = 'coin',
    stats = 'stats',
    liteStats = 'litestats',
    pools = 'pools',
    devs = 'devs',
    devDetails = 'devdetails',
    version = 'version',
    config = 'config',
    ascSet = 'ascset',
}

/**
 * Base class for miners that communicate via the CGMiner-compatible socket API.
 * Provides shared socket command infrastructure for SGMiner, AvalonMiner, and similar devices.
 */
export class SGMiner<S extends SGMinerSettings = SGMinerSettings> extends PollingMiner<S> {
    /**
     *
     */
    public override async init(): Promise<void> {
        await super.init();
        // sgminer/cgminer api does not support persistent connections (socket is closed after each command), so don't need to init any connection here
        return Promise.resolve();
    }

    /**
     *
     */
    public override start(): Promise<void> {
        this.logger.error('start() not (yet) implemented');
        return Promise.resolve();
    }

    /**
     *
     */
    public override async fetchStats(): Promise<MinerStats> {
        try {
            // commands can be combined with '+'. f.e. 'summary+coin'
            const combinedCommand = [SGMinerCommand.summary, SGMinerCommand.coin].join('+');
            const response = await this.sendCommand<object>(combinedCommand, '', true);
            // TODO: parse response => actually return stats

            return {
                raw: response,
            };
        } catch (e) {
            // forward error
            return Promise.reject(e instanceof Error ? e : new Error(String(e)));
        }
    }

    /**
     *
     */
    public override stop(): Promise<void> {
        this.logger.error('stop() not (yet) implemented');
        return Promise.resolve();
    }

    /**
     *
     */
    public override getSupportedFeatures(): MinerFeatureKey[] {
        return [MinerFeatureKey.rawStats];
    }

    /**
     *
     */
    public override getLoggerName(): string {
        return `${super.getLoggerName()}SGMiner[${this.settings.host}:${this.settings.port}]`;
    }

    /**
     *
     */
    public override getCliArgs(): string[] {
        return [`--api_listen=0.0.0.0:${this.settings.port}`];
    }

    /**
     * Send a command to the miner via the CGMiner-compatible socket API.
     *
     * @param command - the command to send
     * @param parameter - optional parameter string
     * @param expectResponse - whether to wait for and return a response
     */
    protected async sendCommand<T = void>(
        command: SGMinerCommand | string,
        parameter: string = '',
        expectResponse: boolean = true,
    ): Promise<T> {
        return sendSocketCommand(
            this.logger,
            this.settings.host,
            this.settings.port,
            {
                command,
                parameter,
            },
            expectResponse,
        );
    }
}
