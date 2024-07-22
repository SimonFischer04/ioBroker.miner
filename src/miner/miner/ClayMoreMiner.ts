import {Socket} from 'node:net';
import {ClaymoreMinerSettings} from '../model/MinerSettings';
import {PollingMiner} from './PollingMiner';

export class ClayMoreMiner extends PollingMiner<ClaymoreMinerSettings> {
    private client: Socket = new Socket();

    public connect(): Promise<void> {
        if (!this.client.pending) {
            // TODO: change to (singleton) logger (file?)
            console.warn('ClayMoreMiner/connect: called with already open socket')
        }

        this.client.connect(this.settings.port, this.settings.host, () => {
            console.log('Connected to server');
            // TODO: set connection state? # ned here, cause des kumt in lib. simply resolve promise only when connected / reject otherwise?
        });

        return Promise.resolve();
    }

    public start(): Promise<void> {
        this.client.write(JSON.stringify({
            id: 0,
            jsonrpc: '2.0',
            method: 'control_gpu',
            params: ['-1', '0']
            // params: ["-1", "2"]
        }) + '\n');

        // promisify()
        return Promise.resolve();
    }

    public fetchData(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public stop(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public close(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}