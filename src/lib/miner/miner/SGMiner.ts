import type { SGMinerSettings } from '../model/MinerSettings';
import { PollingMiner } from './PollingMiner';
import type { MinerStats } from '../model/MinerStats';
import { MinerFeatureKey } from '../model/MinerFeature';
import { sendSocketCommand } from '../../utils/socket-utils';
import { CGMinerCommand, type CombinedResponse } from '../model/CGMinerApiTypes';

/** MH/s → H/s multiplier */
const MHS_TO_HS = 1_000_000;

/** Type alias for the summary+version combined response. */
export type SummaryVersionResponse = CombinedResponse<CGMinerCommand.summary | CGMinerCommand.version>;

/**
 * Base class for miners that communicate via the CGMiner-compatible socket API.
 * Provides shared socket command infrastructure for SGMiner, AvalonMiner, and similar devices.
 */
export class SGMiner<
    S extends SGMinerSettings = SGMinerSettings,
    ExtraCMD extends string = never, // additional commands to allow besides base CGMinerCommand
> extends PollingMiner<S> {
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
            const response = await this.sendCommand<SummaryVersionResponse>(
                [CGMinerCommand.summary, CGMinerCommand.version],
                '',
                true,
            );
            return this.parseSummaryVersionResponse(response);
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
        return [MinerFeatureKey.version, MinerFeatureKey.stats, MinerFeatureKey.rawStats, MinerFeatureKey.cliArgs];
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
        // '--api-listen' is official standard. (SEE: https://github.com/ckolivas/cgminer/blob/master/API-README)
        // but some 'cgminer api compatible miners' may use different args (see f.e. teamRedMiner)
        return [`--api-listen=0.0.0.0:${this.settings.port}`];
    }

    /**
     * Send a command to the miner via the CGMiner-compatible socket API.
     *
     * @param command - the command to send
     * @param parameter - optional parameter string
     * @param expectResponse - whether to wait for and return a response
     */
    protected async sendCommand<T = void>(
        command: (CGMinerCommand | ExtraCMD) | (CGMinerCommand | ExtraCMD)[],
        parameter: string = '',
        expectResponse: boolean = true,
    ): Promise<T> {
        const combinedCommand: string = !Array.isArray(command) ? command : command.join('+'); // cgminer api does allow joining multiple commands using '+'
        return sendSocketCommand(
            this.logger,
            this.settings.host,
            this.settings.port,
            {
                command: combinedCommand,
                parameter,
            },
            expectResponse,
        );
    }

    // public to allow unit tests
    /**
     * Parse a CGMiner "summary+version" combined response into {@link MinerStats}.
     *
     * @param response - raw combined API response
     * @returns parsed miner statistics
     */
    public parseSummaryVersionResponse(response: SummaryVersionResponse): MinerStats {
        const summary = response.summary?.[0]?.SUMMARY?.[0];
        const version = response.version?.[0]?.VERSION?.[0];

        const totalHashrate = summary ? summary['MHS 5s'] * MHS_TO_HS : undefined;
        const acceptedShares = summary?.Accepted;
        const rejectedShares = summary?.Rejected;

        return {
            raw: response,
            version: version?.CGMiner,
            totalHashrate,
            acceptedShares,
            rejectedShares,
        };
    }
}
