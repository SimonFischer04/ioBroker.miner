import {PollingMiner} from './PollingMiner';
import {BOSMinerSettings} from '../model/MinerSettings';
import {MinerStats} from '../model/MinerStats';
import {MinerFeatureKey} from '../model/MinerFeature';
import {sendSocketCommand} from '../../utils/socket-utils';

// based on cgminer, but with different commands
// TODO: inherit?

// old braains api (pre grpc): https://academy.braiins.com/en/braiins-os/papi-bosminer/
enum BOSMinerCommand {
    stats = 'summary+coin',

    // BOS only commands
    pause = 'pause',
    resume = 'resume'
}

export class BOSMiner extends PollingMiner<BOSMinerSettings> {
    public override async start(): Promise<void> {
        await this.sendCommand(BOSMinerCommand.resume, '', false);
    }

    public override async fetchStats(): Promise<MinerStats> {
        try {
            const response = await this.sendCommand<object>(BOSMinerCommand.stats, '', true);
            // TODO: parse response => actually return stats

            return {
                raw: response
            }
        } catch (e) { // forward error
            return Promise.reject(e);
        }
    }

    public override async stop(): Promise<void> {
        await this.sendCommand(BOSMinerCommand.pause, '', false);
    }

    public override getSupportedFeatures(): MinerFeatureKey[] {
        return [
            MinerFeatureKey.running,
            MinerFeatureKey.rawStats
        ]
    }

    public override getLoggerName(): string {
        return `${super.getLoggerName()}BOSMiner[${this.settings.host}:${this.settings.port}]`;
    }

    public override getCliArgs(): string[] {
        return []
    }

    private async sendCommand<T = void>(command: BOSMinerCommand, parameter: string = '', expectResponse: boolean = true): Promise<T> {
        return sendSocketCommand(this.logger, this.settings.host, this.settings.port, {
            command,
            parameter
        }, expectResponse);
    }
}