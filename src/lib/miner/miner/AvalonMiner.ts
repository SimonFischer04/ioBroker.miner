import { PollingMiner } from './PollingMiner';
import type { AvalonMinerSettings } from '../model/MinerSettings';
import type { MinerStats } from '../model/MinerStats';
import { MinerFeatureKey } from '../model/MinerFeature';
import { sendSocketCommand } from '../../utils/socket-utils';
import { Socket } from 'node:net';

// Avalon miners use CGMiner-based API similar to SGMiner
// Reference: https://github.com/c7ph3r10/ha_avalonq

// Timestamp offset in seconds for Avalon control commands
// The Avalon API requires a timestamp in the future for softon/softoff commands
const COMMAND_TIMESTAMP_OFFSET_SECONDS = 5;

// Socket timeout for control commands in milliseconds
const SOCKET_TIMEOUT_MS = 3000;

// Delay before closing socket after sending control command
const CONTROL_COMMAND_TIMEOUT_MS = 1000;

enum AvalonMinerCommand {
    stats = 'stats',
    summary = 'summary',
    coin = 'coin',
    pools = 'pools',
    devs = 'devs',
}

enum AvalonMinerControlCommand {
    // ascset commands for Avalon Q devices
    workmode_eco = 'ascset|0,workmode,set,0',
    workmode_standard = 'ascset|0,workmode,set,1',
    workmode_super = 'ascset|0,workmode,set,2',
    softon = 'ascset|0,softon,1:', // append timestamp
    softoff = 'ascset|0,softoff,1:', // append timestamp
    lcd_on = 'ascset|0,lcd,0:1',
    lcd_off = 'ascset|0,lcd,0:0',
}

/**
 * Avalon Miner implementation
 * Supports Canaan Avalon miners (e.g., Avalon Q Home Miner)
 */
export class AvalonMiner extends PollingMiner<AvalonMinerSettings> {
    /**
     * Start/resume the miner from standby
     */
    public override async start(): Promise<void> {
        const timestamp = Math.floor(Date.now() / 1000) + COMMAND_TIMESTAMP_OFFSET_SECONDS;
        await this.sendControlCommand(`${AvalonMinerControlCommand.softon}${timestamp}`, false);
    }

    /**
     * Fetch stats from the miner
     */
    public override async fetchStats(): Promise<MinerStats> {
        try {
            // Fetch multiple stats in parallel for comprehensive monitoring
            const [summary, stats, coin, pools, devs] = await Promise.all([
                this.sendCommand<object>(AvalonMinerCommand.summary, '', true).catch(() => null),
                this.sendCommand<object>(AvalonMinerCommand.stats, '', true).catch(() => null),
                this.sendCommand<object>(AvalonMinerCommand.coin, '', true).catch(() => null),
                this.sendCommand<object>(AvalonMinerCommand.pools, '', true).catch(() => null),
                this.sendCommand<object>(AvalonMinerCommand.devs, '', true).catch(() => null),
            ]);

            return {
                raw: {
                    summary,
                    stats,
                    coin,
                    pools,
                    devs,
                },
            };
        } catch (e) {
            return Promise.reject(e instanceof Error ? e : new Error(String(e)));
        }
    }

    /**
     * Stop/pause the miner (send to standby)
     */
    public override async stop(): Promise<void> {
        const timestamp = Math.floor(Date.now() / 1000) + COMMAND_TIMESTAMP_OFFSET_SECONDS;
        await this.sendControlCommand(`${AvalonMinerControlCommand.softoff}${timestamp}`, false);
    }

    /**
     * Get supported features for Avalon miners
     */
    public override getSupportedFeatures(): MinerFeatureKey[] {
        return [MinerFeatureKey.running, MinerFeatureKey.rawStats];
    }

    /**
     * Get logger name for this miner
     */
    public override getLoggerName(): string {
        return `${super.getLoggerName()}AvalonMiner[${this.settings.host}:${this.settings.port}]`;
    }

    /**
     * Get CLI arguments (not applicable for Avalon as it's a standalone device)
     */
    public override getCliArgs(): string[] {
        return [];
    }

    /**
     * Send a CGMiner-style command
     *
     * @param command - The command to send
     * @param parameter - Optional parameter for the command
     * @param expectResponse - Whether to expect a response
     */
    private async sendCommand<T = void>(
        command: AvalonMinerCommand,
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

    /**
     * Send an Avalon-specific control command (ascset)
     *
     * @param command - The control command to send
     * @param expectResponse - Whether to expect a response
     */
    private async sendControlCommand(command: string, expectResponse: boolean = false): Promise<void> {
        // Avalon control commands are sent as raw strings, not JSON
        // We'll use a simplified socket approach here
        const socket = new Socket();
        let timeoutHandle: NodeJS.Timeout | undefined;

        return new Promise<void>((resolve, reject) => {
            socket.on('connect', () => {
                this.logger.debug(`sending control command: ${command}`);
                socket.write(`${command}\n`, err => {
                    if (err) {
                        this.logger.error(err.message);
                        reject(new Error(err.message));
                    } else {
                        if (!expectResponse) {
                            resolve();
                        }
                    }
                });
            });

            socket.on('timeout', () => {
                this.logger.warn('socket timeout');
                reject(new Error('socket timeout'));
            });

            socket.on('error', err => {
                this.logger.error(err.message);
                reject(new Error(`socket error: ${err.message}`));
            });

            socket.setTimeout(SOCKET_TIMEOUT_MS);
            socket.connect(this.settings.port, this.settings.host);

            timeoutHandle = setTimeout(() => {
                socket.end();
                socket.destroy();
            }, CONTROL_COMMAND_TIMEOUT_MS);
        }).finally(() => {
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
            }
            socket.end();
            socket.destroy();
        });
    }
}
