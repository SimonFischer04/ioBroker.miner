/**
 * Type definitions for the CGMiner-compatible socket API.
 * Based on Avalon Nano 3S fixture data (cgminer 4.11.1).
 *
 * @see https://github.com/ckolivas/cgminer/blob/master/API-README
 */

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

/**
 * CGMiner API STATUS object, present in every response.
 *
 * @see https://github.com/ckolivas/cgminer/blob/master/API-README
 */
export interface CGMinerStatus {
    /** Status flag: 'S' = success, 'E' = error, 'W' = warning, 'I' = info, 'F' = fatal */
    STATUS: 'S' | 'E' | 'W' | 'I' | 'F';
    /** Unix timestamp of the response */
    When: number;
    /** API response code */
    Code: number;
    /** Human-readable status message */
    Msg: string;
    /** Software description (e.g. "cgminer 4.11.1") */
    Description: string;
}

// ---------------------------------------------------------------------------
// summary
// ---------------------------------------------------------------------------

/**
 * Payload of the "summary" command.
 *
 * @see https://github.com/ckolivas/cgminer/blob/master/API-README
 */
export interface SummaryData {
    /** Elapsed seconds since cgminer started */
    Elapsed: number;

    // --- Hashrate ---
    /** Average megahashes per second (lifetime) */
    'MHS av': number;
    /** Megahashes per second over the last ~5 seconds */
    'MHS 5s': number;
    /** Megahashes per second over the last ~1 minute */
    'MHS 1m': number;
    /** Megahashes per second over the last ~5 minutes */
    'MHS 5m': number;
    /** Megahashes per second over the last ~15 minutes */
    'MHS 15m': number;

    // --- Blocks & Work ---
    /** Number of blocks found */
    'Found Blocks': number;
    /** Number of getwork requests */
    Getworks: number;
    /** Number of accepted shares */
    Accepted: number;
    /** Number of rejected shares */
    Rejected: number;
    /** Number of hardware errors */
    'Hardware Errors': number;
    /** Utility – accepted shares per minute */
    Utility: number;
    /** Number of discarded work items */
    Discarded: number;
    /** Number of stale shares */
    Stale: number;
    /** Number of getwork failures */
    'Get Failures': number;
    /** Number of local work items generated */
    'Local Work': number;
    /** Number of remote failures */
    'Remote Failures': number;
    /** Number of network blocks seen */
    'Network Blocks': number;
    /** Total megahashes done */
    'Total MH': number;
    /** Work utility – diff1 shares per minute */
    'Work Utility': number;

    // --- Difficulty ---
    /** Total difficulty of accepted shares */
    'Difficulty Accepted': number;
    /** Total difficulty of rejected shares */
    'Difficulty Rejected': number;
    /** Total difficulty of stale shares */
    'Difficulty Stale': number;
    /** Best share difficulty found */
    'Best Share': number;

    // --- Percentages ---
    /** Percentage of hardware errors */
    'Device Hardware%': number;
    /** Percentage of device rejected shares */
    'Device Rejected%': number;
    /** Percentage of pool rejected shares */
    'Pool Rejected%': number;
    /** Percentage of pool stale shares */
    'Pool Stale%': number;

    /** Unix timestamp of last getwork (0 if not available) */
    'Last getwork': number;
}

/**
 * Full response for the "summary" command.
 */
export interface SummaryResponse {
    /** Status objects */
    STATUS: CGMinerStatus[];
    /** Summary data (typically a single element) */
    SUMMARY: SummaryData[];
    /** Request id */
    id: number;
}

// ---------------------------------------------------------------------------
// coin
// ---------------------------------------------------------------------------

/**
 * Payload of the "coin" command.
 */
export interface CoinData {
    /** Hashing algorithm (e.g. "sha256") */
    'Hash Method': string;
    /** Seconds since the current block was found */
    'Current Block Time': number;
    /** Hash of the current block being worked on */
    'Current Block Hash': string;
    /** Whether long polling is active */
    LP: boolean;
    /** Current network difficulty */
    'Network Difficulty': number;
}

/**
 * Full response for the "coin" command.
 */
export interface CoinResponse {
    /** Status objects */
    STATUS: CGMinerStatus[];
    /** Coin data (typically a single element) */
    COIN: CoinData[];
    /** Request id */
    id: number;
}

// ---------------------------------------------------------------------------
// version
// ---------------------------------------------------------------------------

/**
 * Payload of the "version" command.
 */
export interface VersionData {
    /** CGMiner version string */
    CGMiner: string;
    /** API version string */
    API: string;
    /** Product name (e.g. "Avalon Nano3s") */
    PROD: string;
    /** Model name (e.g. "Nano3s") */
    MODEL: string;
    /** Hardware type identifier */
    HWTYPE: string;
    /** Software type identifier */
    SWTYPE: string;
    /** Firmware version string */
    LVERSION: string;
    /** Board firmware version string */
    BVERSION: string;
    /** CGMiner firmware version string */
    CGVERSION: string;
    /** Unique device DNA identifier */
    DNA: string;
    /** Ethernet MAC address (no separators) */
    MAC: string;
    /** Update API version */
    UPAPI: string;
}

/**
 * Full response for the "version" command.
 */
export interface VersionResponse {
    /** Status objects */
    STATUS: CGMinerStatus[];
    /** Version data (typically a single element) */
    VERSION: VersionData[];
    /** Request id */
    id: number;
}

// ---------------------------------------------------------------------------
// config
// ---------------------------------------------------------------------------

/**
 * Payload of the "config" command.
 */
export interface ConfigData {
    /** Number of ASC (ASIC) devices */
    'ASC Count': number;
    /** Number of PGA devices */
    'PGA Count': number;
    /** Number of configured pools */
    'Pool Count': number;
    /** Pool strategy (e.g. "Failover") */
    Strategy: string;
    /** Log interval in seconds */
    'Log Interval': number;
    /** Device code (e.g. "AVALON") */
    'Device Code': string;
    /** Operating system (e.g. "Linux") */
    OS: string;
    /** Hotplug setting (e.g. "None") */
    Hotplug: string;
}

/**
 * Full response for the "config" command.
 */
export interface ConfigResponse {
    /** Status objects */
    STATUS: CGMinerStatus[];
    /** Config data (typically a single element) */
    CONFIG: ConfigData[];
    /** Request id */
    id: number;
}

// ---------------------------------------------------------------------------
// pools
// ---------------------------------------------------------------------------

/**
 * Payload of the "pools" command – one entry per configured pool.
 */
export interface PoolData {
    /** Pool index */
    POOL: number;
    /** Pool URL (e.g. "stratum+tcp://stratum.braiins.com:3333") */
    URL: string;
    /** Pool status (e.g. "Alive", "Dead", "Disabled") */
    Status: string;
    /** Pool priority (lower = higher priority) */
    Priority: number;
    /** Pool quota */
    Quota: number;
    /** Long poll support ("Y" or "N") */
    'Long Poll': string;
    /** Number of getwork requests */
    Getworks: number;
    /** Number of accepted shares */
    Accepted: number;
    /** Number of rejected shares */
    Rejected: number;
    /** Number of work items */
    Works: number;
    /** Number of discarded work items */
    Discarded: number;
    /** Number of stale shares */
    Stale: number;
    /** Number of getwork failures */
    'Get Failures': number;
    /** Number of remote failures */
    'Remote Failures': number;
    /** Mining worker username */
    User: string;
    /** Unix timestamp of the last share (0 if never) */
    'Last Share Time': number;
    /** Total diff1 equivalent shares */
    'Diff1 Shares': number;
    /** Proxy type (empty if none) */
    'Proxy Type': string;
    /** Proxy address (empty if none) */
    Proxy: string;
    /** Total difficulty of accepted shares */
    'Difficulty Accepted': number;
    /** Total difficulty of rejected shares */
    'Difficulty Rejected': number;
    /** Total difficulty of stale shares */
    'Difficulty Stale': number;
    /** Difficulty of the last accepted share */
    'Last Share Difficulty': number;
    /** Current work difficulty */
    'Work Difficulty': number;
    /** Whether the pool uses stratum */
    'Has Stratum': boolean;
    /** Whether the stratum connection is currently active */
    'Stratum Active': boolean;
    /** Stratum server hostname */
    'Stratum URL': string;
    /** Current stratum difficulty */
    'Stratum Difficulty': number;
    /** Whether the pool supports version-rolling (AsicBoost) */
    'Has Vmask': boolean;
    /** Whether the pool uses getblocktemplate */
    'Has GBT': boolean;
    /** Best share difficulty submitted to this pool */
    'Best Share': number;
    /** Percentage of pool rejected shares */
    'Pool Rejected%': number;
    /** Percentage of pool stale shares */
    'Pool Stale%': number;
    /** Number of bad work items */
    'Bad Work': number;
    /** Current block height on the network */
    'Current Block Height': number;
    /** Current block version */
    'Current Block Version': number;
}

/**
 * Full response for the "pools" command.
 */
export interface PoolsResponse {
    /** Status objects */
    STATUS: CGMinerStatus[];
    /** Array of pool data, one entry per configured pool */
    POOLS: PoolData[];
    /** Request id */
    id: number;
}

// ---------------------------------------------------------------------------
// devs
// ---------------------------------------------------------------------------

/**
 * Payload of the "devs" command – one entry per ASC/PGA device.
 */
export interface DevData {
    /** ASC device index */
    ASC: number;
    /** Device name (e.g. "AVALON") */
    Name: string;
    /** Device ID */
    ID: number;
    /** Whether the device is enabled ("Y" or "N") */
    Enabled: string;
    /** Device status (e.g. "Alive") */
    Status: string;
    /** Device temperature (°C, 0 if not available) */
    Temperature: number;
    /** Average megahashes per second (lifetime) */
    'MHS av': number;
    /** Megahashes per second over the last ~5 seconds */
    'MHS 5s': number;
    /** Megahashes per second over the last ~1 minute */
    'MHS 1m': number;
    /** Megahashes per second over the last ~5 minutes */
    'MHS 5m': number;
    /** Megahashes per second over the last ~15 minutes */
    'MHS 15m': number;
    /** Number of accepted shares */
    Accepted: number;
    /** Number of rejected shares */
    Rejected: number;
    /** Number of hardware errors */
    'Hardware Errors': number;
    /** Utility – accepted shares per minute */
    Utility: number;
    /** Pool index of the last accepted share */
    'Last Share Pool': number;
    /** Unix timestamp of the last accepted share */
    'Last Share Time': number;
    /** Total megahashes done */
    'Total MH': number;
    /** Total diff1 equivalent work */
    'Diff1 Work': number;
    /** Total difficulty of accepted shares */
    'Difficulty Accepted': number;
    /** Total difficulty of rejected shares */
    'Difficulty Rejected': number;
    /** Difficulty of the last accepted share */
    'Last Share Difficulty': number;
    /** Unix timestamp of the last valid work */
    'Last Valid Work': number;
    /** Percentage of hardware errors */
    'Device Hardware%': number;
    /** Percentage of device rejected shares */
    'Device Rejected%': number;
    /** Seconds since this device started */
    'Device Elapsed': number;
}

/**
 * Full response for the "devs" command.
 */
export interface DevsResponse {
    /** Status objects */
    STATUS: CGMinerStatus[];
    /** Array of device data, one entry per ASC/PGA device */
    DEVS: DevData[];
    /** Request id */
    id: number;
}

// ---------------------------------------------------------------------------
// devdetails
// ---------------------------------------------------------------------------

/**
 * Payload of the "devdetails" command – one entry per device.
 */
export interface DevDetailsData {
    /** Device details index */
    DEVDETAILS: number;
    /** Device name (e.g. "AVALON") */
    Name: string;
    /** Device ID */
    ID: number;
    /** Driver name (e.g. "avalon") */
    Driver: string;
    /** Kernel (empty if not applicable) */
    Kernel: string;
    /** Model (empty if not applicable) */
    Model: string;
    /** Device path (empty if not applicable) */
    'Device Path': string;
}

/**
 * Full response for the "devdetails" command.
 */
export interface DevDetailsResponse {
    /** Status objects */
    STATUS: CGMinerStatus[];
    /** Array of device detail data */
    DEVDETAILS: DevDetailsData[];
    /** Request id */
    id: number;
}

// ---------------------------------------------------------------------------
// stats
// ---------------------------------------------------------------------------

/**
 * Device stats entry from the "stats" command.
 *
 * The `MM ID<n>` field is a flat string of bracket-delimited key-value pairs
 * containing detailed hardware telemetry (Avalon-specific).
 */
export interface StatsDeviceData {
    /** Stats entry index */
    STATS: number;
    /** Device identifier (e.g. "AVALON0") */
    ID: string;
    /** Seconds since cgminer started */
    Elapsed: number;
    /** Number of API calls */
    Calls: number;
    /** Maximum wait time */
    Max: number;
    /** Minimum wait time */
    Min: number;
    /** Average wait time */
    Wait: number;
    /** Number of connected MM modules */
    'MM Count': number;
    /** Nonce mask bits */
    'Nonce Mask': number;
    /**
     * Flat key-value string with detailed device telemetry.
     * Index-keyed: `MM ID0`, `MM ID1`, etc.
     */
    [mmId: `MM ID${number}`]: string;
}

/**
 * Pool stats entry from the "stats" command.
 */
export interface StatsPoolData {
    /** Stats entry index */
    STATS: number;
    /** Pool identifier (e.g. "POOL0") */
    ID: string;
    /** Seconds since cgminer started */
    Elapsed: number;
    /** Number of API calls */
    Calls: number;
    /** Average wait time */
    Wait: number;
    /** Maximum wait time */
    Max: number;
    /** Minimum wait time */
    Min: number;
    /** Number of pool API calls */
    'Pool Calls': number;
    /** Number of pool connection attempts */
    'Pool Attempts': number;
    /** Average pool wait time */
    'Pool Wait': number;
    /** Maximum pool wait time */
    'Pool Max': number;
    /** Minimum pool wait time */
    'Pool Min': number;
    /** Average pool response time */
    'Pool Av': number;
    /** Whether work had roll time */
    'Work Had Roll Time': boolean;
    /** Whether work can roll */
    'Work Can Roll': boolean;
    /** Whether work had expire */
    'Work Had Expire': boolean;
    /** Work roll time in seconds */
    'Work Roll Time': number;
    /** Current work difficulty */
    'Work Diff': number;
    /** Minimum difficulty seen */
    'Min Diff': number;
    /** Maximum difficulty seen */
    'Max Diff': number;
    /** Count of minimum difficulty shares */
    'Min Diff Count': number;
    /** Count of maximum difficulty shares */
    'Max Diff Count': number;
    /** Number of messages sent to the pool */
    'Times Sent': number;
    /** Total bytes sent to the pool */
    'Bytes Sent': number;
    /** Number of messages received from the pool */
    'Times Recv': number;
    /** Total bytes received from the pool */
    'Bytes Recv': number;
    /** Net bytes sent */
    'Net Bytes Sent': number;
    /** Net bytes received */
    'Net Bytes Recv': number;
}

/**
 * Full response for the "stats" command.
 * Contains device stats followed by pool stats.
 */
export interface StatsResponse {
    /** Status objects */
    STATUS: CGMinerStatus[];
    /** Array of stats entries – device entries first, then pool entries */
    STATS: (StatsDeviceData | StatsPoolData)[];
    /** Request id */
    id: number;
}

// ---------------------------------------------------------------------------
// litestats
// ---------------------------------------------------------------------------

/**
 * Lightweight stats entry from the "litestats" command.
 * Similar to stats but with less data; the `MM ID<n>` field contains a
 * subset of the telemetry available in the full stats.
 */
export interface LiteStatsData {
    /** Number of connected MM modules */
    'MM Count': number;
    /** Nonce mask bits */
    'Nonce Mask': number;
    /**
     * Flat key-value string with lightweight device telemetry.
     * Index-keyed: `MM ID0`, `MM ID1`, etc.
     */
    [mmId: `MM ID${number}`]: string;
}

/**
 * Full response for the "litestats" command.
 */
export interface LiteStatsResponse {
    /** Status objects */
    STATUS: CGMinerStatus[];
    /** Array of lightweight stats entries */
    STATS: LiteStatsData[];
    /** Request id */
    id: number;
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

/**
 * CGMiner API query commands that return typed responses.
 *
 * @see https://github.com/ckolivas/cgminer/blob/master/API-README
 */
export enum CGMinerCommand {
    summary = 'summary',
    coin = 'coin',
    version = 'version',
    config = 'config',
    pools = 'pools',
    devs = 'devs',
    devDetails = 'devdetails',
    stats = 'stats',
    liteStats = 'litestats',
}

// ---------------------------------------------------------------------------
// Combined commands
// ---------------------------------------------------------------------------

/**
 * Maps a {@link CGMinerCommand} value to its response type.
 * Used by {@link CombinedResponse} to derive the shape of multi-command
 * responses (e.g. "summary+version").
 */
type CGMinerCommandResponseMap = {
    [CGMinerCommand.summary]: SummaryResponse;
    [CGMinerCommand.coin]: CoinResponse;
    [CGMinerCommand.version]: VersionResponse;
    [CGMinerCommand.config]: ConfigResponse;
    [CGMinerCommand.pools]: PoolsResponse;
    [CGMinerCommand.devs]: DevsResponse;
    [CGMinerCommand.devDetails]: DevDetailsResponse;
    [CGMinerCommand.stats]: StatsResponse;
    [CGMinerCommand.liteStats]: LiteStatsResponse;
};

/**
 * Generic response type for combined CGMiner API commands (e.g. "summary+version").
 *
 * Each requested command key is wrapped in a single-element array,
 * plus a top-level `id` field.
 *
 * @example
 * // Type for "summary+version" combined response:
 * type SummaryVersionResponse = CombinedResponse<CGMinerCommand.summary | CGMinerCommand.version>;
 * // → { summary: [SummaryResponse]; version: [VersionResponse]; id: number }
 */
export type CombinedResponse<K extends keyof CGMinerCommandResponseMap> = {
    [P in K]: [CGMinerCommandResponseMap[P]];
} & { id: number };
