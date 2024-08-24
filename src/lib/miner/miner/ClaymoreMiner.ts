import {ClaymoreMinerSettings} from '../model/MinerSettings';
import {PollingMiner} from './PollingMiner';
import {safeParseInt} from '../../utils/parse-utils';
import {MinerFeatureKey} from '../model/MinerFeature';
import {MinerStats} from '../model/MinerStats';
import {sendSocketCommand} from '../../utils/socket-utils';

enum ClaymoreCommandMethod {
    minerGetStat1 = 'miner_getstat1',
    // TRM example response: {"id":0, "result":["0.10.20 - kawpow", "2672", "48301;5;0", "48301", "0;0;0", "off", "69;62", "kawpow.auto.nicehash.com:443", "0;0;0;0", "5", "0", "0", "0", "0", "0", "3", "1;1;1", "0"], "error":null}
    minerGetStat2 = 'miner_getstat2',

    minerGetFile = 'miner_getfile',
    // TRM: default (like any 'non_existent' method): "CM API rpc method 'non_existent' is not supported."
    minerFile = 'miner_file', // ATTENTION! RCE VULNERABILITY, DO NOT USE THIS METHOD (not supported by trm)

    // TRM: "CM API miner restart rpc is not supported."
    minerRestart = 'miner_restart',

    // TRM: "CM API miner reboot rpc is not supported."
    minerReboot = 'miner_reboot',

    controlGpu = 'control_gpu',
}

export class ClaymoreMiner extends PollingMiner<ClaymoreMinerSettings> {
    public override async init(): Promise<void> {
        await super.init();
        // claymore api does not support persistent connections (socket is closed after each command), so don't need to init any connection here
        return Promise.resolve();
    }

    public override async start(): Promise<void> {
        await this.sendCommand(ClaymoreCommandMethod.controlGpu, ['-1', '1'], false);
    }

    public override async fetchStats(): Promise<MinerStats> {
        try {
            const response: MinerGetStat2Response = await this.sendCommand(ClaymoreCommandMethod.minerGetStat2, undefined, true);
            const parsedResponse: ParsedMinerGetStat2Response = this.parseMinerGetStat2(response);
            this.logger.debug(`parsed response: ${JSON.stringify(parsedResponse)}`);

            return {
                raw: response,
                version: parsedResponse.minerVersion,
                totalHashrate: parsedResponse.ethTotal.hashrate * 1000
            }
        } catch (e) { // forward error
            return Promise.reject(e);
        }
    }

    public override async stop(): Promise<void> {
        await this.sendCommand(ClaymoreCommandMethod.controlGpu, ['-1', '0'], false);
    }

    public override getSupportedFeatures(): MinerFeatureKey[] {
        return [
            MinerFeatureKey.running,
            MinerFeatureKey.rawStats,
            MinerFeatureKey.version,
            MinerFeatureKey.totalHashrate
        ]
    }

    public override getLoggerName(): string {
        return `${super.getLoggerName()}ClaymoreMiner[${this.settings.host}:${this.settings.port}]`;
    }

    public override getCliArgs(): string[] {
        return [
            `--cm_api_listen=0.0.0.0:${this.settings.port}`,
            `--cm_api_password=${this.settings.password}`
        ];
    }

    private async sendCommand<T = void>(method: ClaymoreCommandMethod, params?: string[], expectResponse: boolean = true): Promise<T> {
        return await sendSocketCommand(this.logger, this.settings.host, this.settings.port, {
            id: 0,
            jsonrpc: '2.0',
            psw: this.settings.password,
            method,
            params
        }, expectResponse);
    }

    // public to allow unit tests
    public parseMinerGetStat1(response: MinerGetStat1Response): ParsedMinerGetStat1Response {
        const [
            minerVersion,
            runningTime,
            ethTotalStats,
            ethDetailedHashrate,
            dcrTotalStats,
            dcrDetailedHashrate,
            temperatureAndFanSpeed,
            currentMiningPool,
            invalidSharesAndPoolSwitches
        ] = response.result;

        const [ethHashrate, ethShares, ethRejectedShares] = (ethTotalStats || '0;0;0').split(';').map(safeParseInt);
        const [dcrHashrate, dcrShares, dcrRejectedShares] = (dcrTotalStats || '0;0;0').split(';').map(safeParseInt);
        const [ethInvalidShares, ethPoolSwitches, dcrInvalidShares, dcrPoolSwitches] = (invalidSharesAndPoolSwitches || '0;0;0;0').split(';').map(safeParseInt);

        const gpuInfo = (temperatureAndFanSpeed || '').split(';').reduce<Array<{
            temperature: number;
            fanSpeed: number
        }>>((acc, value, index, array) => {
            if (index % 2 === 0) {
                const temperature = safeParseInt(value);
                const fanSpeed = safeParseInt(array[index + 1]);
                if (temperature !== 0 || fanSpeed !== 0) {
                    acc.push({temperature, fanSpeed});
                }
            }
            return acc;
        }, []);

        return {
            minerVersion: minerVersion || '',
            runningTimeMinutes: safeParseInt(runningTime),
            ethTotal: {
                hashrate: ethHashrate,
                shares: ethShares,
                rejectedShares: ethRejectedShares
            },
            ethDetailedHashrate: ethDetailedHashrate ? ethDetailedHashrate.split(';').map(safeParseInt) : [],
            dcrTotal: {
                hashrate: dcrHashrate,
                shares: dcrShares,
                rejectedShares: dcrRejectedShares
            },
            dcrDetailedHashrate: dcrDetailedHashrate ? dcrDetailedHashrate.split(';').filter(s => s !== '') : [],
            gpuInfo,
            currentMiningPool: currentMiningPool || '',
            stats: {
                ethInvalidShares,
                ethPoolSwitches,
                dcrInvalidShares,
                dcrPoolSwitches
            }
        };
    }

    // public to allow unit tests
    public parseMinerGetStat2(response: MinerGetStat2Response): ParsedMinerGetStat2Response {
        const parsedStat1 = this.parseMinerGetStat1(response as unknown as MinerGetStat1Response);
        const [
            , , , , , , , , ,
            ethAcceptedShares,
            ethRejectedShares,
            ethInvalidShares,
            dcrAcceptedShares,
            dcrRejectedShares,
            dcrInvalidShares,
            pciBusIndexes
        ] = response.result;

        const parseShares = (shares: string) => shares ? shares.split(';').map(safeParseInt) : [];

        return {
            ...parsedStat1,
            ethAcceptedShares: parseShares(ethAcceptedShares),
            ethRejectedShares: parseShares(ethRejectedShares),
            ethInvalidShares: parseShares(ethInvalidShares),
            dcrAcceptedShares: parseShares(dcrAcceptedShares),
            dcrRejectedShares: parseShares(dcrRejectedShares),
            dcrInvalidShares: parseShares(dcrInvalidShares),
            pciBusIndexes: parseShares(pciBusIndexes)
        };
    }
}

export interface MinerGetStat1Response {
    id: number;
    jsonrpc: string;
    result: [
        string,  // Miner version
        string,  // Running time in minutes
        string,  // Total ETH hashrate, shares, rejected shares
        string,  // Detailed ETH hashrate for all GPUs
        string,  // Total DCR hashrate, shares, rejected shares
        string,  // Detailed DCR hashrate for all GPUs
        string,  // Temperature and Fan speed pairs for all GPUs
        string,  // Current mining pool(s)
        string   // ETH invalid shares, pool switches, DCR invalid shares, pool switches
    ];
}

export interface MinerGetStat2Response {
    id: number;
    jsonrpc: string;
    result: [
        ...MinerGetStat1Response['result'],
        string,  // ETH accepted shares for every GPU
        string,  // ETH rejected shares for every GPU
        string,  // ETH invalid shares for every GPU
        string,  // DCR accepted shares for every GPU
        string,  // DCR rejected shares for every GPU
        string,  // DCR invalid shares for every GPU
        string   // PCI bus index for every GPU
    ];
}

// Parsed interfaces
interface ParsedMinerGetStat1Response {
    minerVersion: string;
    runningTimeMinutes: number;
    ethTotal: {
        // actually "ETH hashrate" also means other hashing algorithms
        // in kH/s
        hashrate: number;

        shares: number;
        rejectedShares: number;
    };
    ethDetailedHashrate: number[];
    dcrTotal: {
        hashrate: number;
        shares: number;
        rejectedShares: number;
    };
    dcrDetailedHashrate: string[];
    gpuInfo: Array<{
        temperature: number;
        fanSpeed: number;
    }>;
    currentMiningPool: string;
    stats: {
        ethInvalidShares: number;
        ethPoolSwitches: number;
        dcrInvalidShares: number;
        dcrPoolSwitches: number;
    };
}

interface ParsedMinerGetStat2Response extends ParsedMinerGetStat1Response {
    ethAcceptedShares: number[];
    ethRejectedShares: number[];
    ethInvalidShares: number[];
    dcrAcceptedShares: number[];
    dcrRejectedShares: number[];
    dcrInvalidShares: number[];
    pciBusIndexes: number[];
}