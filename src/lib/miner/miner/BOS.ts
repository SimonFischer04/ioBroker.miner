import { BOS_DEFAULT_PASSWORD, BOS_DEFAULT_USERNAME } from '../model/MinerSettings';
import {
    BosApiClient,
    type BosApiVersion,
    type BosMinerDetails,
    type BosMinerStats,
    type BosTunerState,
    type BosPerformanceMode,
} from '../api/BosApiClient';
import { MinerFeatureKey } from '../model/MinerFeature';
import type { BOSSettings } from '../model/MinerSettings';
import type { MinerStats } from '../model/MinerStats';
import { PollingMiner } from './PollingMiner';
import type { PowerTargetConstraints } from './Miner';
import { toUpdateCheckResult, type UpdateCheckResult } from '../model/UpdateCheckResult';
import { braiinsPlatformDirectory, type UpdateSources } from '../../update/UpdateSources';
import { compareBraiinsBuild } from '../../update/version-compare';

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
        const performanceMode = await this.getClient()
            .getActivePerformanceMode()
            .catch((e: unknown) => {
                // only the configured power target comes from here: don't fail the whole poll for it
                this.logger.debug(`active performance mode not available: ${String(e)}`);
                return undefined;
            });

        return this.parseBosApiResponse(details, stats, apiVersion, tunerState, performanceMode);
    }

    /**
     * Compares the installed build with the newest one Braiins publishes for this control board,
     * and reads the miner's own auto-upgrade setting.
     *
     * @param sources - shared upstream lookups
     */
    public override async checkForUpdate(sources: UpdateSources): Promise<UpdateCheckResult> {
        const details = await this.getClient().getMinerDetails();
        const installed = details.bosVersion?.current;
        const platformDirectory = braiinsPlatformDirectory(details.platform);

        let result: UpdateCheckResult;
        if (platformDirectory) {
            const latest = await sources.braiinsLatestBuild(platformDirectory);
            result = toUpdateCheckResult(installed, latest, compareBraiinsBuild(installed, latest));
        } else {
            this.logger.debug(`no Braiins firmware feed known for platform ${String(details.platform)}`);
            result = { installedVersion: installed };
        }

        result.autoUpgrade = await this.fetchAutoUpgradeStatus();
        return result;
    }

    /**
     * The update check compares the firmware build, not the miner software version.
     */
    public override getInstalledVersionFeature(): MinerFeatureKey.firmwareVersion {
        return MinerFeatureKey.firmwareVersion;
    }

    private async fetchAutoUpgradeStatus(): Promise<UpdateCheckResult['autoUpgrade']> {
        try {
            const status = await this.getClient().getAutoUpgradeStatus();
            const nextRunSeconds = status.nextExecution?.seconds;
            return {
                // proto defaults are omitted on the wire, so a missing flag means false
                enabled: status.enabled === true,
                nextRun: nextRunSeconds ? nextRunSeconds * 1000 : undefined,
            };
        } catch (e) {
            // firmware without the upgrade service: report the update check without it
            this.logger.debug(`auto-upgrade status not available: ${String(e)}`);
            return undefined;
        }
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
            MinerFeatureKey.latestVersion,
            MinerFeatureKey.updateAvailable,
            MinerFeatureKey.autoUpgrade,
            MinerFeatureKey.autoUpgradeNextRun,
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
     * @param performanceMode Optional configured performance mode, containing the configured power target.
     */
    public parseBosApiResponse(
        details: BosMinerDetails,
        stats: BosMinerStats,
        apiVersion?: BosApiVersion,
        tunerState?: BosTunerState,
        performanceMode?: BosPerformanceMode,
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
            raw: { details, stats, apiVersion, tunerState, performanceMode },
            version: formatApiVersion(apiVersion),
            firmwareVersion: details.bosVersion?.current,
            totalHashrate,
            power,
            dynamicPowerTarget,
            // only in power target mode: in hashrate target mode there is no power target to show
            powerTarget: performanceMode?.tunerMode?.powerTarget?.powerTarget?.watt,
            efficiency:
                joulePerTerahash !== undefined && joulePerTerahash > 0
                    ? TERAHASH_TO_HASH / joulePerTerahash
                    : undefined,
            acceptedShares: stats.poolStats?.acceptedShares,
            rejectedShares: stats.poolStats?.rejectedShares,
        };
    }

    /**
     * The power target range from the miner's tuner constraints.
     */
    public override async getPowerTargetConstraints(): Promise<PowerTargetConstraints | undefined> {
        const range = (await this.getClient().getConstraints()).tunerConstraints?.powerTarget;
        if (range?.min?.watt === undefined && range?.max?.watt === undefined) {
            return undefined;
        }
        return { min: range.min?.watt, max: range.max?.watt };
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
            // without a deadline, a call to a hung miner would stay pending forever
            timeoutMs: this.settings.timeoutMs ?? this.getPollTimeoutMs(),
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
