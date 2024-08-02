import {Socket} from 'node:net';
import {ClaymoreMinerSettings} from '../model/MinerSettings';
import {PollingMiner} from './PollingMiner';
import {Logger} from '../model/Logger';

enum ClaymoreCommandMethod {
    minerGetStat1 = 'miner_getstat1',
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

// TODO: psw support
export class ClaymoreMiner extends PollingMiner<ClaymoreMinerSettings> {
    private readonly logger: Logger;

    constructor(settings: ClaymoreMinerSettings) {
        super(settings);

        this.logger = Logger.getLogger(`ClaymoreMiner[${settings.host}:${settings.port}]`);
    }

    public override async init(): Promise<void> {
        await super.init();
        // claymore api does not support persistent connections (socket is closed after each command), so don't need to init any connection here
        return Promise.resolve();
    }

    public override start(): Promise<void> {
        return this.sendCommand(ClaymoreCommandMethod.controlGpu, ['-1', '1']);
    }

    public override async fetchData(): Promise<void> {
        await this.sendCommand(ClaymoreCommandMethod.minerGetStat2)
    }

    public override async stop(): Promise<void> {
        await this.sendCommand(ClaymoreCommandMethod.controlGpu, ['-1', '0']);
    }

    private async sendCommand(method: ClaymoreCommandMethod, params?: string[]): Promise<void> {
        this.logger.debug(`sendCommand: ${method} ${params}`);

        return new Promise((resolve, reject) => {
            const socket: Socket = new Socket();

            socket.on('connect', () => {
                const cmd = JSON.stringify({
                    id: 0,
                    jsonrpc: '2.0',
                    method: method,
                    params
                }) + '\n';
                this.logger.debug(`connected, sending cmd now ...: ${cmd}`);
                socket.write(cmd);
                socket.setTimeout(1000);
            });

            socket.on('timeout', () => {
                socket.end();
                socket.destroy();
                this.logger.warn('socket timeout');
                reject();
            });

            socket.on('data', (data) => {
                const d = JSON.parse(data.toString());

                this.logger.debug(`received: ${data.toString()}`);

                resolve(d);
            });

            socket.on('close', () => {
            }); // discard

            socket.on('error', (err) => {
                reject(`socket error: ${err.message}`);
                this.logger.error(err.message);
                socket.destroy();
                resolve();
            });

            socket.connect(this.settings.port, this.settings.host);
        });
    }
}