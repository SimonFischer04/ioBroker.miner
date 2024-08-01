import {Socket} from 'node:net';
import {ClaymoreMinerSettings} from '../model/MinerSettings';
import {PollingMiner} from './PollingMiner';
import {Logger} from '../model/Logger';

enum ClaymoreCommandMethod {
    minerGetStat1 = 'miner_getstat1',
    minerGetStat2 = 'miner_getstat2',

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

        this.logger = Logger.getLogger('ClaymoreMiner[${settings.host}:${settings.port}]');
    }

    public async connect(): Promise<void> {
        // claymore api does not support persistent connections (socket is closed after each command)
        return Promise.resolve();
    }

    public start(): Promise<void> {
        return this.sendCommand(ClaymoreCommandMethod.controlGpu, ['-1', '1']);
    }

    public fetchData(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public async stop(): Promise<void> {
        await this.sendCommand(ClaymoreCommandMethod.controlGpu, ['-1', '0']);
    }

    public close(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    private async sendCommand(method: ClaymoreCommandMethod, params: string[]): Promise<void> {
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
                this.logger.log(`connected, sending cmd now ...: ${cmd}`);
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

                this.logger.debug(`received: ${d}`);

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