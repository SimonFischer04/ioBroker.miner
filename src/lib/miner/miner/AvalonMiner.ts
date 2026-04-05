import { SGMiner } from './SGMiner';
import type { AvalonMinerSettings } from '../model/MinerSettings';
import type { MinerFeatureKey } from '../model/MinerFeature';

// Avalon devices use the CGMiner-compatible socket API on port 4028
// Control commands use the 'ascset' command with different parameters
// Reference: https://github.com/c7ph3r10/ha_avalonq

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum AvalonMinerCommand {
    // Avalon control commands (all use 'ascset' with different parameters)
    ascset = 'ascset',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum AvalonMinerParameter {
    // do not appear to work on nano 3s
    // softon = '0,softon,1',
    // softoff = '0,softoff,1',
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
export class AvalonMiner extends SGMiner<AvalonMinerSettings> {
    /**
     *
     */
    public override async start(): Promise<void> {
        await super.start();
        // // Wake up from standby mode using softon with a future Unix timestamp
        // const futureTimestamp = Math.floor(Date.now() / 1000) + 5;
        // await this.sendCommand(AvalonMinerCommand.ascset, `${AvalonMinerParameter.softon}:${futureTimestamp}`, false);
    }

    /**
     *
     */
    public override async stop(): Promise<void> {
        await super.stop();
        // // Put device into standby mode using softoff with a future Unix timestamp
        // const futureTimestamp = Math.floor(Date.now() / 1000) + 5;
        // await this.sendCommand(AvalonMinerCommand.ascset, `${AvalonMinerParameter.softoff}:${futureTimestamp}`, false);
    }

    /**
     *
     */
    public override getSupportedFeatures(): MinerFeatureKey[] {
        return [
            ...super.getSupportedFeatures(),
            // MinerFeatureKey.running,
        ];
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
}
