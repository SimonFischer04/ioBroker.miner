import {PollingMiner} from './PollingMiner';
import {IceRiverOcMinerSettings} from '../model/MinerSettings';
import {MinerFeatureKey} from '../model/MinerFeature';
import {MinerStats} from '../model/MinerStats';
import {sendGenericHTTPRequest} from '../../utils/http-utils';

// TODO: support more endpoints
enum IceRiverOcEndpoint {
    sleep = 'api/machine/sleep',
    wake = 'api/machine/wake',
    overview = 'api/overview'
}

interface IceRiverOcResponse {
    error: number;
    message: string;
    // TODO: add more fields
}

export class IceRiverOcMiner extends PollingMiner<IceRiverOcMinerSettings> {
    public override async start(): Promise<void> {
        await this.sendHTTPRequest(IceRiverOcEndpoint.wake, 'GET');
    }

    public override async fetchStats(): Promise<MinerStats> {
        const responseBody = await this.sendHTTPRequest(IceRiverOcEndpoint.overview, 'GET');

        return {
            raw: responseBody
        }
    }

    public override async stop(): Promise<void> {
        await this.sendHTTPRequest(IceRiverOcEndpoint.sleep, 'GET');
    }

    public override getSupportedFeatures(): MinerFeatureKey[] {
        return [
            MinerFeatureKey.running,
            MinerFeatureKey.rawStats
        ];
    }

    public override getLoggerName(): string {
        return `${super.getLoggerName()}IceRiverOcMiner[${this.settings.host}:${this.settings.port}]`;
    }

    public override getCliArgs(): string[] {
        return [];
    }

    private async sendHTTPRequest(endpoint: string, httpMethod: string, body?: object): Promise<IceRiverOcResponse> {
        return sendGenericHTTPRequest<IceRiverOcResponse>('https', this.settings.host, this.settings.port, this.settings.password, this.logger, endpoint, httpMethod, body);
    }
}