import { MinerFeatureKey } from '../model/MinerFeature';
import type { XMRigSettings } from '../model/MinerSettings';
import type { MinerStats } from '../model/MinerStats';
import { PollingMiner } from './PollingMiner';
import { sendGenericHTTPRequest } from '../../utils/http-utils';

// TODO: support more endpoints
enum XMRigEndpoint {
    jsonRPC = 'json_rpc',
    summary = '2/summary',
}

// methods available at the /json_rpc endpoint
// should be on: https://xmrig.com/docs/miner/api/json_rpc (but actually page is empty currently)
enum XMRigJsonRPCMethod {
    pause = 'pause',
    resume = 'resume',
    stop = 'stop', // TODO: what does this do? seems to stop the miner, but get automatically resumed after a few seconds
}

interface JsonRPCResponse {
    result: {
        status: string;
    };
    jsonrpc: string;
    id: string;
}

/**
 *
 */
export class XMRigMiner extends PollingMiner<XMRigSettings> {
    /**
     *
     */
    public override async init(): Promise<void> {
        await super.init();
        // http is stateless!, so don't need to init any connection here
        return Promise.resolve();
    }

    /**
     *
     */
    public override async start(): Promise<void> {
        await this.sendJSONRPCCommand(XMRigJsonRPCMethod.resume);
    }

    /**
     *
     */
    public override async fetchStats(): Promise<MinerStats> {
        const responseBody = await this.sendHTTPRequest<SummaryResponse>(XMRigEndpoint.summary, 'GET');

        return {
            raw: responseBody,
            version: responseBody.version,
            totalHashrate: responseBody.hashrate.total[0],
        };
    }

    /**
     *
     */
    public override async stop(): Promise<void> {
        await this.sendJSONRPCCommand(XMRigJsonRPCMethod.pause);
    }

    /**
     *
     */
    public override getSupportedFeatures(): MinerFeatureKey[] {
        return [
            MinerFeatureKey.running,
            MinerFeatureKey.rawStats,
            MinerFeatureKey.version,
            MinerFeatureKey.totalHashrate,
        ];
    }

    /**
     *
     */
    public override getLoggerName(): string {
        return `${super.getLoggerName()}XMRigMiner[${this.settings.host}:${this.settings.port}]`;
    }

    /**
     *
     */
    public override getCliArgs(): string[] {
        return [
            '--http-host ::',
            `--http-port ${this.settings.port}`,
            `--http-access-token ${this.settings.password}`,
            '--http-no-restricted',
        ];
    }

    private async sendJSONRPCCommand(rpcMethod: XMRigJsonRPCMethod): Promise<void> {
        const responseBody = await this.sendHTTPRequest<JsonRPCResponse>(XMRigEndpoint.jsonRPC, 'POST', {
            method: rpcMethod,
        });

        if (responseBody.result.status !== 'OK') {
            const error = `Error sending JSON-RPC command: ${JSON.stringify(responseBody)}`;
            this.logger.error(error);
            return Promise.reject(new Error(error));
        }
    }

    private async sendHTTPRequest<T>(endpoint: string, httpMethod: string, body?: object): Promise<T> {
        // TODO: https support
        return sendGenericHTTPRequest(
            'http',
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

interface SummaryResponse {
    version: string;
    hashrate: {
        total: [
            number,

            // other coin hashRates???
            number,
            number,
        ];
    };
    // TODO: implement more fields
}
