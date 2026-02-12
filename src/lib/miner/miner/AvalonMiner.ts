import {PollingMiner} from './PollingMiner';
import {AvalonMinerSettings} from '../model/MinerSettings';
import {MinerStats} from '../model/MinerStats';
import {MinerFeatureKey} from '../model/MinerFeature';
import {sendSocketCommand, sendRawSocketCommand} from '../../utils/socket-utils';

// Avalon miners use CGMiner-compatible API
// Reference: https://github.com/c7ph3r10/ha_avalonq
enum AvalonMinerCommand {
    stats = 'stats',
    litestats = 'litestats',
    summary = 'summary',
    pools = 'pools',
    devs = 'devs',
    coin = 'coin',
    version = 'version',
    config = 'config'
}

// Avalon-specific commands using ascset format
enum AvalonControlCommand {
    workmode_eco = 'ascset|0,workmode,set,0',
    workmode_standard = 'ascset|0,workmode,set,1',
    workmode_super = 'ascset|0,workmode,set,2',
    lcd_on = 'ascset|0,lcd,0:1',
    lcd_off = 'ascset|0,lcd,0:0',
    reboot = 'ascset|0,reboot,0'
}

export class AvalonMiner extends PollingMiner<AvalonMinerSettings> {
    public override async init(): Promise<void> {
        await super.init();
        // Avalon uses CGMiner API which does not support persistent connections
        // Socket is closed after each command, so no connection initialization needed
        return Promise.resolve();
    }

    public override async start(): Promise<void> {
        // Wake up from standby mode using softon command with timestamp
        const timestamp = Math.floor(Date.now() / 1000) + 5;
        await this.sendControlCommand(`ascset|0,softon,1:${timestamp}`);
    }

    public override async fetchStats(): Promise<MinerStats> {
        try {
            // Fetch multiple stats similar to the HA addon
            const [summary, stats, pools] = await Promise.all([
                this.sendCommand<object>(AvalonMinerCommand.summary, '', true),
                this.sendCommand<object>(AvalonMinerCommand.stats, '', true),
                this.sendCommand<object>(AvalonMinerCommand.pools, '', true)
            ]);

            return {
                raw: {
                    summary,
                    stats,
                    pools
                }
            };
        } catch (e) {
            return Promise.reject(e);
        }
    }

    public override async stop(): Promise<void> {
        // Send to standby mode using softoff command with timestamp
        const timestamp = Math.floor(Date.now() / 1000) + 5;
        await this.sendControlCommand(`ascset|0,softoff,1:${timestamp}`);
    }

    /**
     * Set workmode for the miner
     * @param mode - 'eco' (0), 'standard' (1), or 'super' (2)
     */
    public async setWorkmode(mode: 'eco' | 'standard' | 'super'): Promise<void> {
        const commandMap = {
            eco: AvalonControlCommand.workmode_eco,
            standard: AvalonControlCommand.workmode_standard,
            super: AvalonControlCommand.workmode_super
        };
        await this.sendControlCommand(commandMap[mode]);
    }

    /**
     * Control LCD display
     * @param on - true to turn on, false to turn off
     */
    public async setLCD(on: boolean): Promise<void> {
        const command = on ? AvalonControlCommand.lcd_on : AvalonControlCommand.lcd_off;
        await this.sendControlCommand(command);
    }

    /**
     * Reboot the miner
     */
    public async reboot(): Promise<void> {
        await this.sendControlCommand(AvalonControlCommand.reboot);
    }

    public override getSupportedFeatures(): MinerFeatureKey[] {
        return [
            MinerFeatureKey.running,
            MinerFeatureKey.rawStats
        ];
    }

    public override getLoggerName(): string {
        return `${super.getLoggerName()}AvalonMiner[${this.settings.host}:${this.settings.port}]`;
    }

    public override getCliArgs(): string[] {
        return [];
    }

    private async sendCommand<T = void>(command: AvalonMinerCommand, parameter: string = '', expectResponse: boolean = true): Promise<T> {
        return sendSocketCommand(this.logger, this.settings.host, this.settings.port, {
            command,
            parameter
        }, expectResponse);
    }

    private async sendControlCommand(command: string): Promise<void> {
        // Control commands use raw string format (ascset format), not JSON
        return sendRawSocketCommand(this.logger, this.settings.host, this.settings.port, command, false);
    }
}
