import type { BOSMinerSettings } from '../model/MinerSettings';
import { MinerFeatureKey } from '../model/MinerFeature';
import { CGMiner } from './CGMiner';
import { Client } from 'ssh2';
import type { ClientChannel } from 'ssh2';

const BOSMINER_CONFIG_PATH = '/etc/bosminer.toml';
const BOSMINER_CONFIG_BACKUP_PATH = '/etc/bosminer.toml.iobroker-power-target.bak';
const BOSMINER_STOP_COMMAND = '/etc/init.d/bosminer stop';
const BOSMINER_START_COMMAND = '/etc/init.d/bosminer start';

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
export class BOSMiner extends CGMiner<BOSMinerSettings, BOSMinerCommand> {
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
     * @param powerTarget - target power in watts
     */
    public override async setPowerTarget(powerTarget: number): Promise<void> {
        const config = await this.runSshCommand(`cat ${shellQuote(BOSMINER_CONFIG_PATH)}`);
        const patchedConfig = patchBosMinerPowerTargetConfig(config, powerTarget);

        const command = [
            buildBosMinerBackupConfigCommand(),
            BOSMINER_STOP_COMMAND,
            `printf '%s' ${shellQuote(patchedConfig)} > ${shellQuote(BOSMINER_CONFIG_PATH)}`,
            BOSMINER_START_COMMAND,
        ].join(' && ');

        await this.runSshCommand(command);
    }

    /**
     *
     */
    public override getSupportedFeatures(): MinerFeatureKey[] {
        // features supported by plain cgMiner base but not here
        const unsupportedFeatures = [MinerFeatureKey.cliArgs];

        return [
            ...super.getSupportedFeatures().filter(feature => !unsupportedFeatures.includes(feature)),
            MinerFeatureKey.running,
            MinerFeatureKey.powerTarget,
        ];
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

    private runSshCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const client = this.createSshClient();
            let settled = false;

            const settle = (handler: () => void): void => {
                if (settled) {
                    return;
                }
                settled = true;
                client.end();
                handler();
            };

            client
                .on('ready', () => {
                    client.exec(command, (execError: Error | undefined, stream: ClientChannel) => {
                        if (execError) {
                            settle(() => reject(execError));
                            return;
                        }

                        let stdout = '';
                        let stderr = '';

                        stream
                            .on('close', (code: number | null) => {
                                if (code === 0) {
                                    settle(() => resolve(stdout));
                                    return;
                                }

                                settle(() =>
                                    reject(
                                        new Error(
                                            `SSH command failed with exit code ${code ?? 'unknown'}: ${stderr || stdout}`,
                                        ),
                                    ),
                                );
                            })
                            .on('data', (data: Buffer) => {
                                stdout += data.toString('utf8');
                            });

                        stream.stderr.on('data', (data: Buffer) => {
                            stderr += data.toString('utf8');
                        });
                    });
                })
                .on('error', error => {
                    settle(() => reject(error));
                })
                .connect(this.getSshConnectionConfig());
        });
    }

    private createSshClient(): Client {
        return new Client();
    }

    private getSshConnectionConfig(): {
        host: string;
        port: number;
        username: string;
        password: string;
        readyTimeout: number;
    } {
        return {
            host: this.settings.host,
            port: this.settings.sshPort ?? 22,
            username: this.settings.username || 'root', // TODO: fix this
            password: this.settings.password ?? '',
            readyTimeout: Math.max(this.settings.pollInterval, 10_000),
        };
    }
}

/**
 * Patch the legacy Braiins OS config file value used by the power-target workaround.
 *
 * @param config - current /etc/bosminer.toml content
 * @param powerTarget - target power in watts
 * @param timestamp - optional unix timestamp in seconds, defaults to current time
 */
export function patchBosMinerPowerTargetConfig(
    config: string,
    powerTarget: number,
    timestamp: number = Math.floor(Date.now() / 1000),
): string {
    let patchedConfig = upsertTomlSectionKey(config, 'format', 'timestamp', String(timestamp));
    patchedConfig = upsertTomlSectionKey(patchedConfig, 'autotuning', 'enabled', 'true');
    patchedConfig = upsertTomlSectionKey(patchedConfig, 'autotuning', 'mode', "'power_target'");
    patchedConfig = upsertTomlSectionKey(patchedConfig, 'autotuning', 'power_target', String(powerTarget));

    // Ensure the config ends with strictly one empty line to prevent unlimited trailing newlines on each write
    return `${patchedConfig.replace(/\s+$/, '')}\n`;
}

/**
 * Build the SSH command that creates the backup if it does not exist yet.
 */
export function buildBosMinerBackupConfigCommand(): string {
    return `test -f ${shellQuote(BOSMINER_CONFIG_BACKUP_PATH)} || cp ${shellQuote(BOSMINER_CONFIG_PATH)} ${shellQuote(BOSMINER_CONFIG_BACKUP_PATH)}`;
}

function shellQuote(value: string): string {
    return `'${value.replaceAll("'", "'\\''")}'`;
}

function upsertTomlSectionKey(config: string, section: string, key: string, value: string): string {
    const sectionHeader = findTomlSectionHeader(config, section);

    if (sectionHeader === undefined) {
        const suffix = config.endsWith('\n') ? '' : '\n';
        return `${config}${suffix}\n[${section}]\n${key} = ${value}\n`;
    }

    const nextSectionStart = findNextTomlSectionStart(config, sectionHeader.contentStart);
    const sectionContentEnd = nextSectionStart ?? config.length;
    const sectionContent = config.slice(sectionHeader.contentStart, sectionContentEnd);
    const keyRegex = new RegExp(`^(\\s*${escapeRegExp(key)}\\s*=\\s*)[^#\\r\\n]*?([ \\t]*(?:#.*)?)$`, 'm');

    if (keyRegex.test(sectionContent)) {
        const patchedSectionContent = sectionContent.replace(keyRegex, `$1${value}$2`);
        return `${config.slice(0, sectionHeader.contentStart)}${patchedSectionContent}${config.slice(sectionContentEnd)}`;
    }

    const separator = sectionContent === '' || sectionContent.endsWith('\n') ? '' : '\n';
    return `${config.slice(0, sectionContentEnd)}${separator}${key} = ${value}\n${config.slice(sectionContentEnd)}`;
}

function findTomlSectionHeader(config: string, section: string): { contentStart: number } | undefined {
    const sectionRegex = new RegExp(`^\\s*\\[${escapeRegExp(section)}]\\s*(?:#.*)?(?:\\r?\\n|$)`, 'm');
    const match = sectionRegex.exec(config);

    if (!match) {
        return undefined;
    }

    return { contentStart: match.index + match[0].length };
}

function findNextTomlSectionStart(config: string, startIndex: number): number | undefined {
    const nextSectionRegex = /^\s*\[[^\]]+]\s*(?:#.*)?(?:\r?\n|$)/m;
    const match = nextSectionRegex.exec(config.slice(startIndex));

    return match ? startIndex + match.index : undefined;
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
