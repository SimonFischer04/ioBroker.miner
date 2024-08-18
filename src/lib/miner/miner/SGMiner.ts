import {SGMinerSettings} from '../model/MinerSettings';
import {PollingMiner} from './PollingMiner';
import {MinerStats} from '../model/MinerStats';
import { MinerFeatureKey } from '../model/MinerFeature';
import {sendSocketCommand} from '../../utils/socket-utils';

// https://github.com/ckolivas/cgminer/blob/master/API-README
enum SGMinerCommand {
    stats = 'summary+coin'
}

export class SGMiner extends PollingMiner<SGMinerSettings> {
    public override async init(): Promise<void> {
        await super.init();
        // sgminer/cgminer api does not support persistent connections (socket is closed after each command), so don't need to init any connection here
        return Promise.resolve();
    }

    public override start(): Promise<void> {
        this.logger.error('start() not (yet) implemented');
        return Promise.resolve();
    }

    public override async fetchStats(): Promise<MinerStats> {
        try{
            const response =  await this.sendCommand<object>(SGMinerCommand.stats, '', true);
            // TODO: parse response => actually return stats

            return {
                raw: response
            }
        } catch (e) { // forward error
            return Promise.reject(e);
        }
    }

    public override stop(): Promise<void> {
        this.logger.error('stop() not (yet) implemented');
        return Promise.resolve();
    }

    public getSupportedFeatures(): MinerFeatureKey[] {
        return [
            MinerFeatureKey.rawStats
        ]
    }

    public override getLoggerName(): string {
        return `${super.getLoggerName()}SGMiner[${this.settings.host}:${this.settings.port}]`;
    }

    public getCliArgs(): string[] {
        return [
            '--api_listen=0.0.0.0:4028'
        ]
    }

    private async sendCommand<T = void>(command: SGMinerCommand, parameter: string = '', expectResponse: boolean = true): Promise<T> {
        return sendSocketCommand(this.logger, this.settings.host, this.settings.port, {
            command,
            parameter
        }, expectResponse);
    }
}