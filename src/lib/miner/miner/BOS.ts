import { BOS_DEFAULT_PASSWORD, BOS_DEFAULT_USERNAME } from '../model/MinerSettings';
import {
    BosApiClient,
    type BosApiVersion,
    type BosHashboard,
    type BosHashboards,
    type BosMinerDetails,
    type BosMinerStats,
    type BosTunerState,
    type BosPerformanceMode,
} from '../api/BosApiClient';
import { MinerFeatureKey } from '../model/MinerFeature';
import type { BOSSettings } from '../model/MinerSettings';
import type { MinerStats } from '../model/MinerStats';
import {
    instantiateDynamicCustomChannel,
    type CustomChannelDefinition,
    type CustomFeatureDefinition,
    type CustomFeatureValue,
    type DynamicCustomChannelDefinition,
} from '../model/CustomFeature';
import { PollingMiner } from './PollingMiner';
import type { PowerTargetConstraints } from './Miner';
import { toUpdateCheckResult, type UpdateCheckContext, type UpdateCheckResult } from '../model/UpdateCheckResult';
import { braiinsPlatformDirectory, type UpdateSources } from '../../update/UpdateSources';
import { compareBraiinsBuild } from '../../update/version-compare';

const GHASH_TO_HASH = 1_000_000_000;
const TERAHASH_TO_HASH = 1_000_000_000_000;
const HERTZ_TO_MEGAHERTZ = 1 / 1_000_000;

const temperatureFeature = (id: string, label: string, description: string): CustomFeatureDefinition => ({
    id,
    label,
    description,
    type: 'number',
    role: 'value.temperature',
    unit: '°C',
    readable: true,
    writable: false,
});

/**
 * One channel per hashboard (`custom.hashboard<id>`). BOS reports chip data only per board: the chip count and type,
 * and the temperature of the hottest chip.
 */
const HASHBOARD_CHANNEL: DynamicCustomChannelDefinition = {
    id: 'hashboard',
    label: 'Hashboard',
    features: [
        {
            id: 'enabled',
            label: 'Enabled',
            description: 'Whether the hashboard is enabled.',
            type: 'boolean',
            role: 'indicator',
            readable: true,
            writable: false,
        },
        {
            id: 'chipsCount',
            label: 'Chips',
            description: 'Number of chips on the hashboard.',
            type: 'number',
            role: 'value',
            readable: true,
            writable: false,
        },
        {
            id: 'chipType',
            label: 'Chip Type',
            description: 'Type of the chips on the hashboard.',
            type: 'string',
            role: 'text',
            readable: true,
            writable: false,
        },
        temperatureFeature('highestChipTemp', 'Highest Chip Temperature', 'Temperature of the hottest chip.'),
        temperatureFeature('boardTemp', 'Board Temperature', 'Temperature of the hashboard.'),
        temperatureFeature('lowestInletTemp', 'Lowest Inlet Temperature', 'Lowest inlet temperature.'),
        temperatureFeature('highestOutletTemp', 'Highest Outlet Temperature', 'Highest outlet temperature.'),
        temperatureFeature(
            'lowestWaterInletTemp',
            'Lowest Water Inlet Temperature',
            'Lowest water inlet temperature (hydro cooling only).',
        ),
        temperatureFeature(
            'highestWaterOutletTemp',
            'Highest Water Outlet Temperature',
            'Highest water outlet temperature (hydro cooling only).',
        ),
        {
            id: 'voltage',
            label: 'Voltage',
            description: 'Current voltage of the hashboard.',
            type: 'number',
            role: 'value.voltage',
            unit: 'V',
            readable: true,
            writable: false,
        },
        {
            id: 'frequency',
            label: 'Frequency',
            description: 'Current chip frequency of the hashboard.',
            type: 'number',
            role: 'value',
            unit: 'MHz',
            readable: true,
            writable: false,
        },
        {
            id: 'hashrate',
            label: 'Hashrate',
            description: 'Hashrate of the hashboard (last 5 seconds).',
            type: 'number',
            role: 'value',
            unit: 'h/s',
            readable: true,
            writable: false,
        },
        {
            id: 'nominalHashrate',
            label: 'Nominal Hashrate',
            description: 'Nominal hashrate of the hashboard.',
            type: 'number',
            role: 'value',
            unit: 'h/s',
            readable: true,
            writable: false,
        },
        {
            id: 'model',
            label: 'Model',
            description: 'Model of the hashboard.',
            type: 'string',
            role: 'text',
            readable: true,
            writable: false,
            advanced: true,
        },
        {
            id: 'boardName',
            label: 'Board Name',
            description: 'Board name of the hashboard.',
            type: 'string',
            role: 'text',
            readable: true,
            writable: false,
            advanced: true,
        },
        {
            id: 'serialNumber',
            label: 'Serial Number',
            description: 'Serial number of the hashboard.',
            type: 'string',
            role: 'text',
            readable: true,
            writable: false,
            advanced: true,
        },
    ],
};

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
     * Ids of the hashboards the last poll reported.
     */
    private hashboardIds: string[] = [];

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
        const hashboards = await this.getClient()
            .getHashboards()
            .catch((e: unknown) => {
                // only the hashboard custom features come from here: don't fail the whole poll for them
                this.logger.debug(`hashboards not available: ${String(e)}`);
                return undefined;
            });
        if (hashboards) {
            this.hashboardIds = (hashboards.hashboards ?? []).map(hashboardId);
        }

        return this.parseBosApiResponse(details, stats, apiVersion, tunerState, performanceMode, hashboards);
    }

    /**
     * Compares the installed build with the newest one Braiins publishes for this control board,
     * and reads the miner's own auto-upgrade setting.
     *
     * @param sources - shared upstream lookups
     * @param context - persisted metadata, so firmware feeds can be checked while the miner is offline
     */
    public override async checkForUpdate(
        sources: UpdateSources,
        context?: UpdateCheckContext,
    ): Promise<UpdateCheckResult> {
        const savedDetails = (context?.lastStats?.raw as { details?: BosMinerDetails } | undefined)?.details;
        const details = braiinsPlatformDirectory(savedDetails?.platform)
            ? savedDetails!
            : context?.online === false
              ? (savedDetails ?? {})
              : await this.getClient().getMinerDetails();
        const installed = details.bosVersion?.current ?? context?.lastStats?.firmwareVersion;
        const platformDirectory = braiinsPlatformDirectory(details.platform);

        let result: UpdateCheckResult;
        if (platformDirectory) {
            const latest = await sources.braiinsLatestBuild(platformDirectory);
            result = toUpdateCheckResult(installed, latest, compareBraiinsBuild(installed, latest));
        } else {
            this.logger.debug(`no Braiins firmware feed known for platform ${String(details.platform)}`);
            result = { installedVersion: installed };
        }

        // Auto-upgrade is a live setting, unlike the public firmware feed. Don't let an offline miner delay it.
        if (context?.online !== false) {
            result.autoUpgrade = await this.fetchAutoUpgradeStatus();
        }
        return result;
    }

    /**
     * A channel per hashboard the last poll reported.
     */
    public override getCustomChannels(): CustomChannelDefinition[] {
        return this.hashboardIds.map(id => instantiateDynamicCustomChannel(HASHBOARD_CHANNEL, id));
    }

    /**
     * The hashboard channel template: the number of hashboards is only known after a poll.
     */
    public override getDynamicCustomChannels(): DynamicCustomChannelDefinition[] {
        return [HASHBOARD_CHANNEL];
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
     * @param hashboards Optional hashboard details, reported as custom features.
     */
    public parseBosApiResponse(
        details: BosMinerDetails,
        stats: BosMinerStats,
        apiVersion?: BosApiVersion,
        tunerState?: BosTunerState,
        performanceMode?: BosPerformanceMode,
        hashboards?: BosHashboards,
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
            raw: { details, stats, apiVersion, tunerState, performanceMode, hashboards },
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
            ...(hashboards ? { custom: toHashboardValues(hashboards) } : {}),
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

/**
 * The id of a hashboard as BOS reports it (e.g. `1`), or its position if it has none.
 *
 * @param board - the hashboard
 * @param index - its position in the response
 */
function hashboardId(board: BosHashboard, index: number): string {
    return board.id || String(index + 1);
}

/**
 * Custom feature values of all hashboards, keyed by `hashboard<id>.<feature>`. Values a board doesn't report are left
 * out, so their states keep the last value.
 *
 * @param response - the GetHashboards response
 */
export function toHashboardValues(response: BosHashboards): Record<string, CustomFeatureValue> {
    const values: Record<string, CustomFeatureValue> = {};

    (response.hashboards ?? []).forEach((board, index) => {
        const channel = instantiateDynamicCustomChannel(HASHBOARD_CHANNEL, hashboardId(board, index)).id;
        const hashrate = board.stats?.realHashrate?.last_5s?.gigahashPerSecond;
        const nominalHashrate = board.stats?.nominalHashrate?.gigahashPerSecond;
        const frequency = board.currentFrequency?.hertz;
        const boardValues: Record<string, CustomFeatureValue | undefined> = {
            // proto defaults are omitted on the wire, so a missing flag means false
            enabled: board.enabled === true,
            chipsCount: board.chipsCount?.value,
            chipType: board.chipType,
            highestChipTemp: board.highestChipTemp?.temperature?.degreeC,
            boardTemp: board.boardTemp?.degreeC,
            lowestInletTemp: board.lowestInletTemp?.degreeC,
            highestOutletTemp: board.highestOutletTemp?.degreeC,
            lowestWaterInletTemp: board.lowestWaterInletTemp?.degreeC,
            highestWaterOutletTemp: board.highestWaterOutletTemp?.degreeC,
            voltage: board.currentVoltage?.volt,
            frequency: frequency !== undefined ? frequency * HERTZ_TO_MEGAHERTZ : undefined,
            hashrate: hashrate !== undefined ? hashrate * GHASH_TO_HASH : undefined,
            nominalHashrate: nominalHashrate !== undefined ? nominalHashrate * GHASH_TO_HASH : undefined,
            model: board.model,
            boardName: board.boardName,
            serialNumber: board.serialNumber,
        };
        for (const [feature, value] of Object.entries(boardValues)) {
            if (value !== undefined) {
                values[`${channel}.${feature}`] = value;
            }
        }
    });

    return values;
}
