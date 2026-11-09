import { CGMiner } from './CGMiner';
import type { AvalonMinerSettings } from '../model/MinerSettings';
import { MinerFeatureKey } from '../model/MinerFeature';
import type { MinerStats } from '../model/MinerStats';
import {
    CGMinerCommand,
    type CGMinerStatus,
    type CombinedResponse,
    type LiteStatsData,
    type StatsDeviceData,
    type StatsResponse,
    type VersionData,
    type VersionResponse,
} from '../model/CGMinerApiTypes';
import { toUpdateCheckResult, type UpdateCheckContext, type UpdateCheckResult } from '../model/UpdateCheckResult';
import type { UpdateSources } from '../../update/UpdateSources';
import { parseAvalonBuild } from '../../update/version-compare';
import { safeParseFloat } from '../../utils/parse-utils';
import { buildQrAuthParameter, parseAuthChallenge, type AvalonAuthChallenge } from '../api/AvalonWebLogin';
import type { CustomChannelDefinition, CustomFeatureValue } from '../model/CustomFeature';

// Avalon devices use the CGMiner-compatible socket API on port 4028
// Control commands use the 'ascset' command with different parameters
// Reference: https://github.com/c7ph3r10/ha_avalonq

enum AvalonMinerCommand {
    // Avalon control commands (all use 'ascset' with different parameters)
    ascset = 'ascset',
}

enum AvalonMinerParameter {
    // do not appear to work on nano 3s
    // softon = '0,softon,1',
    // softoff = '0,softoff,1',
    workModeLow = '0,workmode,set,0',
    workModeMedium = '0,workmode,set,1',
    workModeHigh = '0,workmode,set,2',
    // Future: reboot = '0,reboot,0',
    // LED ring: `0,ledset,<effect>-<brightness>-<colorTemperature>-<red>-<green>-<blue>`, see buildLedSetParameter
    ledSet = '0,ledset',
    // LCD: `0,lcd,0:1` (on) / `0,lcd,0:0` (off)
    lcd = '0,lcd,0',
}

const AVALON_PROFILE_PARAM_MAP: Record<string, string> = {
    low: AvalonMinerParameter.workModeLow,
    medium: AvalonMinerParameter.workModeMedium,
    high: AvalonMinerParameter.workModeHigh,
} as const;

const AVALON_PROFILES = Object.keys(AVALON_PROFILE_PARAM_MAP);

/**
 * Profile for each work mode the miner reports in the `WORKMODE[<n>]` telemetry field (the `n` of `workmode,set,<n>`).
 */
const AVALON_WORKMODE_PROFILES = new Map<string | undefined, string>([
    ['0', 'low'],
    ['1', 'medium'],
    ['2', 'high'],
]);

/**
 * Effects of the LED ring, as used by `ledset` and reported in `LEDUser`. 0 is off.
 */
export enum AvalonLedEffect {
    off = 0,
    static = 1,
    flash = 2,
    breath = 3,
    loop = 4,
}

/**
 * Settings of the LED ring, as reported in the `LEDUser[effect-brightness-colorTemperature-red-green-blue]` telemetry
 * field and sent with `ledset` (which always takes all of them).
 */
export interface AvalonLedSettings {
    /**
     * 0 (off) to 4, see {@link AvalonLedEffect}.
     */
    effect: number;
    /**
     * 0-100 %.
     */
    brightness: number;
    /**
     * 0-100.
     */
    colorTemperature: number;
    /**
     * 0-255.
     */
    red: number;
    /**
     * 0-255.
     */
    green: number;
    /**
     * 0-255.
     */
    blue: number;
}

/**
 * Custom feature ids (`<channel>.<feature>`) of the Avalon miner.
 */
export enum AvalonCustomFeature {
    lightOn = 'light.on',
    lightEffect = 'light.effect',
    lightBrightness = 'light.brightness',
    lightColorTemperature = 'light.colorTemperature',
    lightColor = 'light.color',
    lcdOn = 'lcd.on',
}

const AVALON_CUSTOM_CHANNELS: CustomChannelDefinition[] = [
    {
        id: 'light',
        label: 'Light',
        features: [
            {
                id: 'on',
                label: 'Light',
                description: 'Whether the LED light is on.',
                type: 'boolean',
                role: 'switch.light',
                readable: true,
                writable: true,
            },
            {
                id: 'effect',
                label: 'Light Effect',
                description:
                    'Effect of the LED light. Kept while the light is off and used again when it is turned on.',
                type: 'number',
                role: 'level',
                states: {
                    [AvalonLedEffect.static]: 'Static',
                    [AvalonLedEffect.flash]: 'Flash',
                    [AvalonLedEffect.breath]: 'Breath',
                    [AvalonLedEffect.loop]: 'Loop',
                },
                readable: true,
                writable: true,
            },
            {
                id: 'brightness',
                label: 'Light Brightness',
                description: 'Brightness of the LED light.',
                type: 'number',
                role: 'level.dimmer',
                unit: '%',
                min: 0,
                max: 100,
                step: 1,
                readable: true,
                writable: true,
            },
            {
                id: 'colorTemperature',
                label: 'Light Color Temperature',
                description: 'Color temperature of the LED light (0-100).',
                type: 'number',
                role: 'level',
                min: 0,
                max: 100,
                step: 1,
                readable: true,
                writable: true,
            },
            {
                id: 'color',
                label: 'Light Color',
                description: 'Color of the LED light as #RRGGBB.',
                type: 'string',
                role: 'level.color.rgb',
                readable: true,
                writable: true,
            },
        ],
    },
    {
        id: 'lcd',
        label: 'Display',
        features: [
            {
                id: 'on',
                label: 'Display',
                description: 'Whether the display (LCD) is on.',
                type: 'boolean',
                role: 'switch',
                readable: true,
                writable: true,
            },
        ],
    },
];

/**
 * Parses the `LEDUser` telemetry field: `effect-brightness-colorTemperature-red-green-blue`, e.g. `0-100-50-0-0-255`.
 *
 * @param value - the field's value
 * @returns the settings, or undefined if the value doesn't have this format
 */
export function parseAvalonLedUser(value: string | undefined): AvalonLedSettings | undefined {
    const parts = value?.trim().split('-');
    if (parts?.length !== 6 || !parts.every(part => /^\d+$/.test(part))) {
        return undefined;
    }
    const [effect, brightness, colorTemperature, red, green, blue] = parts.map(Number);
    return { effect, brightness, colorTemperature, red, green, blue };
}

/**
 * Builds the `ascset` parameter that applies the given LED settings.
 *
 * @param led - the complete LED settings
 */
export function buildLedSetParameter(led: AvalonLedSettings): string {
    return `${AvalonMinerParameter.ledSet},${[led.effect, led.brightness, led.colorTemperature, led.red, led.green, led.blue].join('-')}`;
}

/**
 * Formats red, green and blue (0-255) as `#rrggbb`.
 *
 * @param led - the LED settings to take the color from
 */
export function toHexColor(led: Pick<AvalonLedSettings, 'red' | 'green' | 'blue'>): string {
    return `#${[led.red, led.green, led.blue].map(c => c.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Parses a `#rrggbb` (or `rrggbb`) color, case-insensitive.
 *
 * @param color - the color
 * @throws {Error} if it isn't in this format
 */
export function parseHexColor(color: string): Pick<AvalonLedSettings, 'red' | 'green' | 'blue'> {
    const match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color.trim());
    if (!match) {
        throw new Error(`invalid color "${color}", expected #RRGGBB`);
    }
    return { red: parseInt(match[1], 16), green: parseInt(match[2], 16), blue: parseInt(match[3], 16) };
}

/**
 * Default port of the miner's web interface.
 */
const AVALON_WEB_PORT = 80;

/**
 * Type alias for the summary+version+stats(+litestats) combined response. `litestats` has no STATS on firmware that
 * doesn't know the command: cgminer then answers just that part of the combined request with "Invalid command".
 */
export type SummaryVersionStatsResponse = CombinedResponse<
    CGMinerCommand.summary | CGMinerCommand.version | CGMinerCommand.stats
> &
    Partial<CombinedResponse<CGMinerCommand.liteStats>>;

/**
 *
 */
export class AvalonMiner extends CGMiner<AvalonMinerSettings, AvalonMinerCommand> {
    /**
     * LED settings the miner reported last (or that were set last): `ledset` always takes all of them, so changing one
     * needs the others.
     */
    private ledSettings: AvalonLedSettings | undefined;

    /**
     * Effect to use when the light is turned on: the last one that wasn't off.
     */
    private lastLedEffect: number = AvalonLedEffect.static;

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
    public override async fetchStats(): Promise<MinerStats> {
        try {
            // litestats carries the WiFi signal strength; it joins the same request instead of costing a second one
            const response = await this.sendCommand<SummaryVersionStatsResponse>(
                [CGMinerCommand.summary, CGMinerCommand.version, CGMinerCommand.stats, CGMinerCommand.liteStats],
                '',
                true,
            );

            const stats = this.parseSummaryVersionStatsResponse(response);
            this.rememberLedSettings(
                this.extractLedSettings(response.stats?.[0]?.STATS, response.litestats?.[0]?.STATS),
            );
            return stats;
        } catch (e) {
            return Promise.reject(e instanceof Error ? e : new Error(String(e)));
        }
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
        // features supported by plain cgMiner base but not here
        const unsupportedFeatures = [MinerFeatureKey.cliArgs];

        return [
            ...super.getSupportedFeatures().filter(feature => !unsupportedFeatures.includes(feature)),
            MinerFeatureKey.profile,
            MinerFeatureKey.rssi,
            // MinerFeatureKey.running,
            MinerFeatureKey.latestVersion,
            MinerFeatureKey.updateAvailable,
        ];
    }

    /**
     * Compares the installed firmware with the latest one Canaan publishes, for the models Canaan's
     * update file covers (Nano 3). Other models report only the installed version.
     *
     * @param sources - shared upstream lookups
     * @param context - persisted identity for offline firmware checks
     */
    public override async checkForUpdate(
        sources: UpdateSources,
        context?: UpdateCheckContext,
    ): Promise<UpdateCheckResult> {
        if (context?.online === false) {
            const savedVersion = (context.lastStats?.raw as { version?: VersionResponse[] } | undefined)?.version?.[0]
                ?.VERSION?.[0];
            return this.checkVersionForUpdate(savedVersion, sources);
        }
        const response = await this.sendCommand<VersionResponse>(CGMinerCommand.version, '', true);
        return this.checkVersionForUpdate(response.VERSION?.[0], sources);
    }

    /**
     * The update check compares the firmware build, not the miner software version.
     */
    public override getInstalledVersionFeature(): MinerFeatureKey.firmwareVersion {
        return MinerFeatureKey.firmwareVersion;
    }

    // public to allow unit tests
    /**
     * Update check for an already fetched `version` response.
     *
     * @param version - version data reported by the miner
     * @param sources - shared upstream lookups
     * @returns the update check result
     */
    public async checkVersionForUpdate(
        version: VersionData | undefined,
        sources: UpdateSources,
    ): Promise<UpdateCheckResult> {
        const installed = version?.LVERSION;

        // The feed's nano3 entry names heater_nano3_all. It does not identify Nano 3S compatibility.
        // Match the model exactly: Nano3s, Nano3 Pro, etc. must not inherit Nano 3 firmware.
        if (!/^nano\s*3$/i.test(version?.MODEL?.trim() ?? '')) {
            this.logger.debug(`no update source for Avalon model ${version?.MODEL ?? '(unknown)'}`);
            return { installedVersion: installed };
        }

        const latest = await sources.avalonNano3LatestBuild();
        const installedBuild = parseAvalonBuild(installed);
        return toUpdateCheckResult(
            installed,
            latest,
            // the same comparison Canaan's own app uses
            installedBuild === undefined ? undefined : installedBuild - Number(latest),
        );
    }

    /**
     * Get available performance profiles for the Avalon miner.
     */
    public override getProfiles(): string[] {
        return AVALON_PROFILES;
    }

    /**
     * Set the active performance profile on the Avalon miner.
     *
     * @param profile - the profile name to activate (low, medium, high)
     */
    public override async setProfile(profile: string): Promise<void> {
        const params = AVALON_PROFILE_PARAM_MAP[profile];
        if (params === undefined) {
            const valid = this.getProfiles().join(', ');
            this.logger.error(`Invalid profile "${profile}". Valid profiles: ${valid}`);
            return;
        }

        this.logger.info(`Setting Avalon workmode to "${profile}" (id=${params})`);
        await this.sendAscset(params, 'workmode');
    }

    /**
     * Approves the login a browser is waiting for on the miner's web interface, like scanning its QR code with the
     * Avalon Family app would. The browser showing the login page is logged in on its next status check (within 5 s).
     *
     * @throws {Error} if no web password is configured, the miner can't be reached, or it rejects the login (a wrong
     *  password reads "passwd error 02!")
     */
    public async approveWebLogin(): Promise<void> {
        const password = this.settings.webPassword;
        if (!password) {
            throw new Error('no web password configured');
        }

        const challenge = await this.fetchAuthChallenge();
        await this.sendAscset(buildQrAuthParameter(challenge, password), 'qr_auth');
        this.logger.info('web login approved');
    }

    /**
     * The LED light and the display.
     */
    public override getCustomChannels(): CustomChannelDefinition[] {
        return AVALON_CUSTOM_CHANNELS;
    }

    /**
     * Sends a light or display change. Light changes are sent together with the other current LED settings, as
     * `ledset` needs all of them.
     *
     * @param id - see {@link AvalonCustomFeature}
     * @param value - the new value, checked against the feature's definition
     */
    protected override async applyCustomFeature(id: string, value: CustomFeatureValue): Promise<void> {
        if (id === AvalonCustomFeature.lcdOn) {
            await this.sendAscset(`${AvalonMinerParameter.lcd}:${value ? 1 : 0}`, 'lcd');
            return;
        }

        const led: AvalonLedSettings = { ...(this.ledSettings ?? (await this.fetchLedSettings())) };
        switch (id as AvalonCustomFeature) {
            case AvalonCustomFeature.lightOn:
                led.effect = value ? this.lastLedEffect : AvalonLedEffect.off;
                break;
            case AvalonCustomFeature.lightEffect:
                // choosing an effect also turns the light on
                led.effect = Number(value);
                break;
            case AvalonCustomFeature.lightBrightness:
                led.brightness = Number(value);
                break;
            case AvalonCustomFeature.lightColorTemperature:
                led.colorTemperature = Number(value);
                break;
            case AvalonCustomFeature.lightColor:
                Object.assign(led, parseHexColor(String(value)));
                break;
            default:
                return super.applyCustomFeature(id, value);
        }

        await this.sendAscset(buildLedSetParameter(led), 'ledset');
        this.rememberLedSettings(led);
    }

    /**
     * Sends an `ascset` command and checks the miner accepted it.
     *
     * @param parameter - the `ascset` parameter
     * @param what - name of the setting for the error message
     * @throws {Error} if the miner doesn't answer or rejects the command
     */
    private async sendAscset(parameter: string, what: string): Promise<void> {
        const response = await this.sendCommand<{ STATUS?: CGMinerStatus[] }>(
            AvalonMinerCommand.ascset,
            parameter,
            true,
        );
        const status = response?.STATUS?.[0];
        if (!status || status.STATUS === 'E' || status.STATUS === 'F') {
            throw new Error(status?.Msg ?? `no reply to ${what}`);
        }
    }

    /**
     * Asks the miner for its current LED settings, for a light change before the first poll.
     */
    private async fetchLedSettings(): Promise<AvalonLedSettings> {
        const response = await this.sendCommand<StatsResponse>(CGMinerCommand.stats, '', true);
        const led = this.extractLedSettings(response.STATS);
        if (!led) {
            throw new Error('the miner does not report its LED settings');
        }
        this.rememberLedSettings(led);
        return led;
    }

    private rememberLedSettings(led: AvalonLedSettings | undefined): void {
        if (!led) {
            return;
        }
        this.ledSettings = led;
        if (led.effect !== AvalonLedEffect.off) {
            this.lastLedEffect = led.effect;
        }
    }

    /**
     * Fetches the challenge the miner's login page shows as QR code. Also makes the miner (re)generate it, so the
     * login can be approved even if the page has not loaded it yet.
     */
    private async fetchAuthChallenge(): Promise<AvalonAuthChallenge> {
        const webPort = this.settings.webPort ?? AVALON_WEB_PORT;
        const response = await fetch(`http://${this.settings.host}:${webPort}/get_auth.cgi`, {
            signal: AbortSignal.timeout(this.getPollTimeoutMs()),
        });
        if (!response.ok) {
            throw new Error(`get_auth.cgi failed: ${response.status} ${response.statusText}`);
        }
        return parseAuthChallenge(await response.text());
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

    // public to allow unit tests
    /**
     * Parse an Avalon `MM ID<n>` telemetry string into a key-value map.
     *
     * The string uses bracket-delimited pairs: `Key1[value1] Key2[value2] ...`
     * Values may contain spaces (e.g. `PS[0 0 27697 4 0 3678 132]`).
     *
     * @param telemetry - raw MM ID telemetry string
     * @returns map of key → value strings
     */
    public parseAvalonTelemetry(telemetry: string): Map<string, string> {
        const result = new Map<string, string>();
        const regex = /(\w+)\[([^\]]*)\]/g;
        let match: RegExpExecArray | null;
        while ((match = regex.exec(telemetry)) !== null) {
            result.set(match[1], match[2]);
        }
        return result;
    }

    // public to allow unit tests
    /**
     * Parse a CGMiner "summary+version+stats" combined response into {@link MinerStats}.
     * Extracts power consumption from the Avalon-specific MM ID telemetry string.
     *
     * The `PS` field in MM ID telemetry has the format:
     * `PS[vin1 vin2 pin vout1 vout2 pout watt]`
     * where `watt` (index 6) is total power consumption in watts.
     *
     * @param response - raw combined API response
     * @returns parsed miner statistics including power
     */
    public parseSummaryVersionStatsResponse(response: SummaryVersionStatsResponse): MinerStats {
        // Parse summary+version via the parent method
        const baseStats = this.parseSummaryVersionResponse(response);

        const statsEntries = response.stats?.[0]?.STATS;
        const liteStatsEntries = response.litestats?.[0]?.STATS;

        // Extract power from the stats response
        const power = this.extractPowerFromStats(statsEntries);

        const custom = this.toCustomValues(
            this.extractLedSettings(statsEntries, liteStatsEntries),
            this.extractTelemetryField('LcdOnoff', statsEntries, liteStatsEntries),
        );

        return {
            ...baseStats,
            power,
            efficiency: power != null && baseStats.totalHashrate ? baseStats.totalHashrate / power : undefined,
            rssi: this.extractRssiFromLiteStats(liteStatsEntries),
            profile: AVALON_WORKMODE_PROFILES.get(this.extractTelemetryField('WORKMODE', statsEntries)),
            ...(Object.keys(custom).length > 0 ? { custom } : {}),
        };
    }

    /**
     * Custom feature values for the reported LED settings and display state.
     *
     * @param led - LED settings, if reported
     * @param lcdOnOff - value of the `LcdOnoff` telemetry field, if reported
     */
    private toCustomValues(
        led: AvalonLedSettings | undefined,
        lcdOnOff: string | undefined,
    ): Record<string, CustomFeatureValue> {
        const custom: Record<string, CustomFeatureValue> = {};
        if (led) {
            custom[AvalonCustomFeature.lightOn] = led.effect !== AvalonLedEffect.off;
            // while the light is off, the effect state keeps the effect it will be turned on with
            if (led.effect !== AvalonLedEffect.off) {
                custom[AvalonCustomFeature.lightEffect] = led.effect;
            }
            custom[AvalonCustomFeature.lightBrightness] = led.brightness;
            custom[AvalonCustomFeature.lightColorTemperature] = led.colorTemperature;
            custom[AvalonCustomFeature.lightColor] = toHexColor(led);
        }
        if (lcdOnOff === '0' || lcdOnOff === '1') {
            custom[AvalonCustomFeature.lcdOn] = lcdOnOff === '1';
        }
        return custom;
    }

    /**
     * LED settings from the `LEDUser` telemetry field.
     *
     * @param statsEntries - STATS array from a stats response
     * @param liteStatsEntries - STATS array from a litestats response, used if stats doesn't report the field
     */
    private extractLedSettings(
        statsEntries: readonly object[] | undefined,
        liteStatsEntries?: readonly object[],
    ): AvalonLedSettings | undefined {
        return parseAvalonLedUser(this.extractTelemetryField('LEDUser', statsEntries, liteStatsEntries));
    }

    /**
     * A field of the first device's `MM ID<n>` telemetry string, from the first of the given STATS arrays reporting it.
     *
     * @param field - name of the telemetry field, e.g. `LEDUser`
     * @param entryLists - STATS arrays of stats/litestats responses, in order of preference
     */
    private extractTelemetryField(field: string, ...entryLists: (readonly object[] | undefined)[]): string | undefined {
        for (const entries of entryLists) {
            const value = this.firstDeviceTelemetry(entries)?.get(field);
            if (value !== undefined) {
                return value;
            }
        }
        return undefined;
    }

    /**
     * The parsed `MM ID<n>` telemetry string of the first device entry (the one with `MM Count`, not a pool entry).
     *
     * @param entries - STATS array from a stats or litestats response
     */
    private firstDeviceTelemetry(entries: readonly object[] | undefined): Map<string, string> | undefined {
        const entry = entries?.find(e => 'MM Count' in e) as Record<string, unknown> | undefined;
        const mmIdKey = entry && Object.keys(entry).find(key => key.startsWith('MM ID'));
        const telemetry = mmIdKey ? entry[mmIdKey] : undefined;
        return typeof telemetry === 'string' && telemetry ? this.parseAvalonTelemetry(telemetry) : undefined;
    }

    /**
     * Extract power consumption (watts) from the first device entry in a stats response.
     *
     * Looks for the `PS` field in the first `MM ID<n>` telemetry string.
     * `PS[vin1 vin2 pin vout1 vout2 pout watt]` — `watt` (index 6) is total power consumption in watts.
     *
     * @param statsEntries - STATS array from a stats response
     * @returns power in watts, or undefined if not available
     */
    private extractPowerFromStats(statsEntries: (StatsDeviceData | { ID: string })[] | undefined): number | undefined {
        const psValue = this.firstDeviceTelemetry(statsEntries)?.get('PS');
        if (!psValue) {
            return undefined;
        }

        // PS[vin1 vin2 pin vout1 vout2 pout watt] — watt is index 6, in watts
        const parts = psValue.trim().split(/\s+/);
        if (parts.length < 7) {
            return undefined;
        }

        const watts = safeParseFloat(parts[6]);
        return watts > 0 ? watts : undefined;
    }

    /**
     * Extract the WiFi signal strength from the first device entry of a litestats response: `RSSI[-55]` in the first
     * `MM ID<n>` telemetry string.
     *
     * @param liteStatsEntries - STATS array from a litestats response
     * @returns RSSI in dBm, or undefined if not reported (e.g. a wired connection or a firmware without litestats)
     */
    private extractRssiFromLiteStats(liteStatsEntries: LiteStatsData[] | undefined): number | undefined {
        // not safeParseFloat: it turns garbage into 0, which would look like a (perfect) reading
        const rssi = Number.parseFloat(this.firstDeviceTelemetry(liteStatsEntries)?.get('RSSI') ?? '');
        return Number.isFinite(rssi) ? rssi : undefined;
    }
}
