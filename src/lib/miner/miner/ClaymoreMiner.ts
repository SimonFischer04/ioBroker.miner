import {Socket} from 'node:net';
import {ClaymoreMinerSettings} from '../model/MinerSettings';
import {PollingMiner} from './PollingMiner';

export class ClaymoreMiner extends PollingMiner<ClaymoreMinerSettings> {
    private client: Socket = new Socket();

    public async connect(): Promise<void> {
        if (!this.client.pending) {
            // TODO: change to (singleton) logger (file?)
            console.warn('ClaymoreMiner/connect: called with already open socket')
            return;
        }

        try {
            this.client.on('data', (data) => {
                console.log('Received: ', data.toString());
                // client.destroy();
            });

            this.client.on('close', () => {
                console.log('Connection closed');
            });

            this.client.on('error', (err) => {
                console.error('Error:', err);
            });

            this.client.connect(this.settings.port, this.settings.host, () => {
                console.log('Connected to server');
                // this.start();
                this.stop();
                // TODO: set connection state? # ned here, cause des kumt in lib. simply resolve promise only when connected / reject otherwise?
            });
        } catch (e) {
            console.error('ClaymoreMiner/connect: failed to connect to server', e);
            return Promise.reject(e);
        }

        return Promise.resolve();
    }

    public start(): Promise<void> {
        this.client.write(JSON.stringify({
            id: 0,
            jsonrpc: '2.0',
            method: 'control_gpu',
            params: ['-1', '2']
        }) + '\n');

        // TODO
        // promisify()
        return Promise.resolve();
    }

    public fetchData(): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public stop(): Promise<void> {
        this.client.write(JSON.stringify({
            id: 0,
            jsonrpc: '2.0',
            method: 'control_gpu',
            params: ['-1', '0']
        }) + '\n');

        return Promise.resolve();
    }

    public close(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}