import { PollingMiner } from './PollingMiner';
import type { AvalonMinerSettings } from '../model/MinerSettings';
import type { MinerStats } from '../model/MinerStats';
import { MinerFeatureKey } from '../model/MinerFeature';
import { sendSocketCommand } from '../../utils/socket-utils';

// Avalon devices use the CGMiner-compatible socket API on port 4028
// Control commands use the 'ascset' command with different parameters
// Reference: https://github.com/c7ph3r10/ha_avalonq

enum AvalonMinerCommand {
    stats = 'summary+stats',

    // Avalon control commands (all use 'ascset' with different parameters)
    ascset = 'ascset',
}

enum AvalonMinerParameter {
    softon = '0,softon,1',
    softoff = '0,softoff,1',
    // Future: workmodeEco = '0,workmode,set,0',
    // Future: workmodeStandard = '0,workmode,set,1',
    // Future: workmodeSuper = '0,workmode,set,2',
    // Future: reboot = '0,reboot,0',
    // Future: lcdOn = '0,lcd,0:1',
    // Future: lcdOff = '0,lcd,0:0',
}

/**
 *
 */
export class AvalonMiner extends PollingMiner<AvalonMinerSettings> {
    /**
     *
     */
    public override async start(): Promise<void> {
        // Wake up from standby mode using softon with a future Unix timestamp
        const futureTimestamp = Math.floor(Date.now() / 1000) + 5;
        await this.sendCommand(AvalonMinerCommand.ascset, `${AvalonMinerParameter.softon}:${futureTimestamp}`, false);
    }

    /**
     *
     */
    public override async fetchStats(): Promise<MinerStats> {
        try {
            const response = await this.sendCommand<object>(AvalonMinerCommand.stats, '', true);
            return {
                raw: response,
            };
        } catch (e) {
            return Promise.reject(e instanceof Error ? e : new Error(String(e)));
        }
    }

    /**
     *
     */
    public override async stop(): Promise<void> {
        // Put device into standby mode using softoff with a future Unix timestamp
        const futureTimestamp = Math.floor(Date.now() / 1000) + 5;
        await this.sendCommand(AvalonMinerCommand.ascset, `${AvalonMinerParameter.softoff}:${futureTimestamp}`, false);
    }

    /**
     *
     */
    public override getSupportedFeatures(): MinerFeatureKey[] {
        return [MinerFeatureKey.running, MinerFeatureKey.rawStats];
    }

    /**
     *
     */
    public override getLoggerName(): string {
        return `${super.getLoggerName()}AvalonMiner[${this.settings.host}:${this.settings.port}]`;
    }

    /**
     *
     */
    public override getCliArgs(): string[] {
        return [];
    }

    private async sendCommand<T = void>(
        command: string,
        parameter: string = '',
        expectResponse: boolean = true,
    ): Promise<T> {
        return sendSocketCommand(
            this.logger,
            this.settings.host,
            this.settings.port,
            {
                command,
                parameter,
            },
            expectResponse,
        );
    }
}
