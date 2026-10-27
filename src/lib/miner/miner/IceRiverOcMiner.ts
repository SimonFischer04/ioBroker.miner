import { PollingMiner } from './PollingMiner';
import type { IceRiverOcMinerSettings } from '../model/MinerSettings';
import { MinerFeatureKey } from '../model/MinerFeature';
import type { MinerStats } from '../model/MinerStats';
import { sendGenericHTTPRequest } from '../../utils/http-utils';
import { toUpdateCheckResult, type UpdateCheckResult } from '../model/UpdateCheckResult';
import type { UpdateSources } from '../../update/UpdateSources';
import { compareSemver, extractSemver, parseIceRiverOcVersion } from '../../update/version-compare';

// TODO: support more endpoints
enum IceRiverOcEndpoint {
    sleep = 'api/machine/sleep',
    wake = 'api/machine/wake',
    overview = 'api/overview',
}

interface IceRiverOcResponse {
    error: number;
    message: string;
    // TODO: add more fields
}

/**
 * The parts of `/api/overview` used here (see external/iceriver-oc_apidoc.json).
 */
interface IceRiverOcOverviewResponse extends IceRiverOcResponse {
    data?: {
        /** ASIC model name */
        model?: string;
        /** name/version of the miner package, e.g. "pbv077c_ks0miner" */
        softver1?: string;
    };
}

/**
 *
 */
export class IceRiverOcMiner extends PollingMiner<IceRiverOcMinerSettings> {
    /**
     *
     */
    public override async start(): Promise<void> {
        await this.sendHTTPRequest(IceRiverOcEndpoint.wake, 'GET');
    }

    /**
     *
     */
    public override async fetchStats(): Promise<MinerStats> {
        const responseBody = (await this.sendHTTPRequest(
            IceRiverOcEndpoint.overview,
            'GET',
        )) as IceRiverOcOverviewResponse;

        return {
            raw: responseBody,
            version: responseBody.data?.softver1,
        };
    }

    /**
     *
     */
    public override async stop(): Promise<void> {
        await this.sendHTTPRequest(IceRiverOcEndpoint.sleep, 'GET');
    }

    /**
     * Compares the installed OC firmware with the latest release of rdugan/iceriver-oc on GitHub.
     *
     * @param sources - shared upstream lookups
     */
    public override async checkForUpdate(sources: UpdateSources): Promise<UpdateCheckResult> {
        const overview = (await this.sendHTTPRequest(IceRiverOcEndpoint.overview, 'GET')) as IceRiverOcOverviewResponse;
        const softver = overview.data?.softver1;
        const installed = parseIceRiverOcVersion(softver);
        const latestTag = await sources.githubLatestRelease('rdugan', 'iceriver-oc');
        return toUpdateCheckResult(
            installed ?? softver,
            extractSemver(latestTag) ?? latestTag,
            compareSemver(installed, latestTag),
        );
    }

    /**
     *
     */
    public override getSupportedFeatures(): MinerFeatureKey[] {
        return [
            MinerFeatureKey.running,
            MinerFeatureKey.version,
            MinerFeatureKey.rawStats,
            MinerFeatureKey.latestVersion,
            MinerFeatureKey.updateAvailable,
        ];
    }

    /**
     *
     */
    public override getLoggerName(): string {
        return `${super.getLoggerName()}IceRiverOcMiner[${this.settings.host}:${this.settings.port}]`;
    }

    /**
     *
     */
    public override getCliArgs(): string[] {
        return [];
    }

    private async sendHTTPRequest(endpoint: string, httpMethod: string, body?: object): Promise<IceRiverOcResponse> {
        return sendGenericHTTPRequest<IceRiverOcResponse>(
            'https',
            this.settings.host,
            this.settings.port,
            this.settings.password,
            this.logger,
            endpoint,
            httpMethod,
            body,
        );
    }
}
