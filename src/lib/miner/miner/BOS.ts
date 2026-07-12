import { BOS_DEFAULT_PASSWORD, BOS_DEFAULT_USERNAME } from '../model/MinerSettings';
import {
    BosApiClient,
    type BosApiVersion,
    type BosMinerDetails,
    type BosMinerStats,
    type BosTunerState,
} from '../api/BosApiClient';
import { MinerFeatureKey } from '../model/MinerFeature';
import type { BOSSettings } from '../model/MinerSettings';
import type { MinerStats } from '../model/MinerStats';
import { PollingMiner } from './PollingMiner';

const GHASH_TO_HASH = 1_000_000_000;
const TERAHASH_TO_HASH = 1_000_000_000_000;

// new "bos public api"
// see: https://academy.braiins.com/braiins-os/papi-about and https://braiins.com/os-firmware/download
// bos: firmware >= 23.03 (S19 Series and above)
// bosMiner: firmware < 23.03 (pre S19 - (s9, s17))

/**
 *
 */
export class BOS extends PollingMiner<BOSSettings> {
    private client: BosApiClient | undefined;

    /**
     *
     */
    public override async init(): Promise<void> {
        this.client = this.createClient();
        await super.init();
    }

    /**
     *
     */
    public override async start(): Promise<void> {
        await this.getClient().resumeMining();
    }

    /**
     *
     */
    public override async stop(): Promise<void> {
        await this.getClient().pauseMining();
    }

    /**
     *
     * @param powerTarget Target power value in watts to apply on the miner.
     */
    public override async setPowerTarget(powerTarget: number): Promise<void> {
        await this.getClient().setPowerTarget(powerTarget);
    }

    /**
     *
     */
    public override async fetchStats(): Promise<MinerStats> {
        const details = await this.getClient().getMinerDetails();
        const stats = await this.getClient().getMinerStats();
        const apiVersion = await this.getClient().getApiVersion();
        const tunerState = await this.getClient().getTunerState();

        return this.parseBosApiResponse(details, stats, apiVersion, tunerState);
    }

    /**
     *
     */
    public override async close(): Promise<void> {
        this.client?.close();
        this.client = undefined;
        await super.close();
    }

    /**
     *
     */
    public override getSupportedFeatures(): MinerFeatureKey[] {
        return [
            MinerFeatureKey.running,
            MinerFeatureKey.version,
            MinerFeatureKey.firmwareVersion,
            MinerFeatureKey.powerTarget,
            MinerFeatureKey.stats,
            MinerFeatureKey.rawStats,
        ];
    }

    /**
     *
     */
    public override getLoggerName(): string {
        return `${super.getLoggerName()}BOS[${this.settings.host}:${this.settings.port}]`;
    }

    /**
     *
     */
    public override getCliArgs(): string[] {
        return [];
    }

    /**
     *
     * @param details Miner metadata returned by the Braiins OS API.
     * @param stats Live miner statistics returned by the Braiins OS API.
     * @param apiVersion Optional Braiins OS API version payload.
     * @param tunerState Optional tuner state payload containing power target data.
     */
    public parseBosApiResponse(
        details: BosMinerDetails,
        stats: BosMinerStats,
        apiVersion?: BosApiVersion,
        tunerState?: BosTunerState,
    ): MinerStats {
        const hashrate = stats.minerStats?.realHashrate;
        const totalHashrate =
            hashrate?.last_5s?.gigahashPerSecond !== undefined
                ? hashrate.last_5s.gigahashPerSecond * GHASH_TO_HASH
                : undefined;
        const power = stats.powerStats?.approximatedConsumption?.watt;
        const dynamicPowerTarget = tunerState?.powerTargetModeState?.currentTarget?.watt;
        const joulePerTerahash = stats.powerStats?.efficiency?.joulePerTerahash;

        return {
            raw: { details, stats, apiVersion, tunerState },
            version: formatApiVersion(apiVersion),
            firmwareVersion: details.bosVersion?.current,
            totalHashrate,
            power,
            dynamicPowerTarget,
            efficiency:
                joulePerTerahash !== undefined && joulePerTerahash > 0
                    ? TERAHASH_TO_HASH / joulePerTerahash
                    : undefined,
            acceptedShares: stats.poolStats?.acceptedShares,
            rejectedShares: stats.poolStats?.rejectedShares,
        };
    }

    private getClient(): BosApiClient {
        this.client ??= this.createClient();
        return this.client;
    }

    private createClient(): BosApiClient {
        return new BosApiClient({
            host: this.settings.host,
            port: this.settings.port,
            secure: this.settings.secure,
            timeoutMs: this.settings.timeoutMs,
            username: this.settings.username || BOS_DEFAULT_USERNAME,
            password: this.settings.password || BOS_DEFAULT_PASSWORD,
        });
    }
}

function formatApiVersion(version?: BosApiVersion): string | undefined {
    if (!version) {
        return undefined;
    }

    const baseVersion = `${version.major ?? 0}.${version.minor ?? 0}.${version.patch ?? 0}`;
    const preRelease = version.pre ? `-${version.pre}` : '';
    const build = version.build ? `+${version.build}` : '';
    return `${baseVersion}${preRelease}${build}`;
}
