import { SGMiner } from './SGMiner';
import type { AvalonMinerSettings } from '../model/MinerSettings';
import { MinerFeatureKey } from '../model/MinerFeature';
import type { MinerStats } from '../model/MinerStats';
import { CGMinerCommand, type CombinedResponse, type StatsDeviceData } from '../model/CGMinerApiTypes';
import { safeParseFloat } from '../../utils/parse-utils';

// Avalon devices use the CGMiner-compatible socket API on port 4028
// Control commands use the 'ascset' command with different parameters
// Reference: https://github.com/c7ph3r10/ha_avalonq

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum AvalonMinerCommand {
    // Avalon control commands (all use 'ascset' with different parameters)
    ascset = 'ascset',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum AvalonMinerParameter {
    // do not appear to work on nano 3s
    // softon = '0,softon,1',
    // softoff = '0,softoff,1',
    // Future: workmodeEco = '0,workmode,set,0',
    // Future: workmodeStandard = '0,workmode,set,1',
    // Future: workmodeSuper = '0,workmode,set,2',
    // Future: reboot = '0,reboot,0',
    // Future: lcdOn = '0,lcd,0:1',
    // Future: lcdOff = '0,lcd,0:0',
}

/** Type alias for the summary+version+stats combined response. */
export type SummaryVersionStatsResponse = CombinedResponse<
    CGMinerCommand.summary | CGMinerCommand.version | CGMinerCommand.stats
>;

/**
 *
 */
export class AvalonMiner extends SGMiner<AvalonMinerSettings> {
    /**
     *
     */
    public override async start(): Promise<void> {
        await super.start();
        // // Wake up from standby mode using softon with a future Unix timestamp
        // const futureTimestamp = Math.floor(Date.now() / 1000) + 5;
        // await this.sendCommand(AvalonMinerCommand.ascset, `${AvalonMinerParameter.softon}:${futureTimestamp}`, false);
    }

    /**
     *
     */
    public override async fetchStats(): Promise<MinerStats> {
        try {
            const response = await this.sendCommand<SummaryVersionStatsResponse>(
                [CGMinerCommand.summary, CGMinerCommand.version, CGMinerCommand.stats],
                '',
                true,
            );

            return this.parseSummaryVersionStatsResponse(response);
        } catch (e) {
            return Promise.reject(e instanceof Error ? e : new Error(String(e)));
        }
    }

    /**
     *
     */
    public override async stop(): Promise<void> {
        await super.stop();
        // // Put device into standby mode using softoff with a future Unix timestamp
        // const futureTimestamp = Math.floor(Date.now() / 1000) + 5;
        // await this.sendCommand(AvalonMinerCommand.ascset, `${AvalonMinerParameter.softoff}:${futureTimestamp}`, false);
    }

    /**
     *
     */
    public override getSupportedFeatures(): MinerFeatureKey[] {
        // features supported by plain cgMiner base but not here
        const unsupportedFeatures = [MinerFeatureKey.cliArgs];

        return [
            ...super.getSupportedFeatures().filter(feature => !unsupportedFeatures.includes(feature)),
            MinerFeatureKey.profile,
            // MinerFeatureKey.running,
        ];
    }

    /**
     * Get available performance profiles for the Avalon miner.
     */
    public override getProfiles(): string[] {
        return ['low', 'medium', 'high'];
    }

    /**
     * Set the active performance profile on the Avalon miner.
     *
     * @param profile - the profile name to activate (low, medium, high)
     */
    public override setProfile(profile: string): Promise<void> {
        const profiles = this.getProfiles();
        if (!profiles.includes(profile)) {
            this.logger.error(`Invalid profile "${profile}". Valid profiles: ${profiles.join(', ')}`);
            return Promise.resolve();
        }
        // TODO: send the actual ascset command to the device once the Avalon API mapping is known
        this.logger.info(`Setting profile to "${profile}" (not yet wired to hardware)`);
        return Promise.resolve();
    }

    /**
     *
     */
    public override getLoggerName(): string {
        return `${super.getLoggerName()}AvalonMiner[${this.settings.host}:${this.settings.port}]`;
    }

    /**
     *
     */
    public override getCliArgs(): string[] {
        return [];
    }

    // public to allow unit tests
    /**
     * Parse an Avalon `MM ID<n>` telemetry string into a key-value map.
     *
     * The string uses bracket-delimited pairs: `Key1[value1] Key2[value2] ...`
     * Values may contain spaces (e.g. `PS[0 0 27697 4 0 3678 132]`).
     *
     * @param telemetry - raw MM ID telemetry string
     * @returns map of key → value strings
     */
    public parseAvalonTelemetry(telemetry: string): Map<string, string> {
        const result = new Map<string, string>();
        const regex = /(\w+)\[([^\]]*)\]/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(telemetry)) !== null) {
            result.set(match[1], match[2]);
        }
        return result;
    }

    // public to allow unit tests
    /**
     * Parse a CGMiner "summary+version+stats" combined response into {@link MinerStats}.
     * Extracts power consumption from the Avalon-specific MM ID telemetry string.
     *
     * The `PS` field in MM ID telemetry has the format:
     * `PS[vin1 vin2 pin vout1 vout2 pout watt]`
     * where `watt` (index 6) is total power consumption in watts.
     *
     * @param response - raw combined API response
     * @returns parsed miner statistics including power
     */
    public parseSummaryVersionStatsResponse(response: SummaryVersionStatsResponse): MinerStats {
        // Parse summary+version via the parent method
        const baseStats = this.parseSummaryVersionResponse(response);

        // Extract power from the stats response
        const power = this.extractPowerFromStats(response.stats?.[0]?.STATS);

        return {
            ...baseStats,
            power,
            efficiency: power != null && baseStats.totalHashrate ? baseStats.totalHashrate / power : undefined,
        };
    }

    /**
     * Extract power consumption (watts) from the first device entry in a stats response.
     *
     * Looks for the `PS` field in the first `MM ID<n>` telemetry string.
     * `PS[vin1 vin2 pin vout1 vout2 pout watt]` — `watt` (index 6) is total power consumption in watts.
     *
     * @param statsEntries - STATS array from a stats response
     * @returns power in watts, or undefined if not available
     */
    private extractPowerFromStats(statsEntries: (StatsDeviceData | { ID: string })[] | undefined): number | undefined {
        if (!statsEntries) {
            return undefined;
        }

        // Find the first device entry (ID starts with "AVALON", not "POOL")
        const deviceEntry = statsEntries.find((entry): entry is StatsDeviceData => 'MM Count' in entry);
        if (!deviceEntry) {
            return undefined;
        }

        // Find the first MM ID field
        const mmIdKey = Object.keys(deviceEntry).find(key => key.startsWith('MM ID'));
        if (!mmIdKey) {
            return undefined;
        }

        const telemetry = deviceEntry[mmIdKey as `MM ID${number}`];
        if (!telemetry) {
            return undefined;
        }

        const parsed = this.parseAvalonTelemetry(telemetry);
        const psValue = parsed.get('PS');
        if (!psValue) {
            return undefined;
        }

        // PS[vin1 vin2 pin vout1 vout2 pout watt] — watt is index 6, in watts
        const parts = psValue.trim().split(/\s+/);
        if (parts.length < 7) {
            return undefined;
        }

        const watts = safeParseFloat(parts[6]);
        return watts > 0 ? watts : undefined;
    }
}
