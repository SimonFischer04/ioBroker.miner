import type { BOSMinerSettings } from '../model/MinerSettings';
import { MinerFeatureKey } from '../model/MinerFeature';
import { SGMiner } from './SGMiner';

// old braains api (pre grpc): https://academy.braiins.com/en/braiins-os/papi-bosminer/
// based on cgminer, but adds some extra commands
// Note: TypeScript enums cannot extend other enums. BOS-specific commands are defined separately; CGMinerCommand values are used directly where needed.
enum BOSMinerCommand {
    pause = 'pause',
    resume = 'resume',
}

/**
 *
 */
export class BOSMiner extends SGMiner<BOSMinerSettings, BOSMinerCommand> {
    /**
     *
     */
    public override async start(): Promise<void> {
        await this.sendCommand(BOSMinerCommand.resume, '', false);
    }

    /**
     *
     */
    public override async stop(): Promise<void> {
        await this.sendCommand(BOSMinerCommand.pause, '', false);
    }

    /**
     *
     */
    public override getSupportedFeatures(): MinerFeatureKey[] {
        return [...super.getSupportedFeatures(), MinerFeatureKey.running];
    }

    /**
     *
     */
    public override getLoggerName(): string {
        return `${super.getLoggerName()}BOSMiner[${this.settings.host}:${this.settings.port}]`;
    }

    /**
     *
     */
    public override getCliArgs(): string[] {
        return [];
    }
}
