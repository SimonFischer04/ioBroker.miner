/**
 * CGMiner API STATUS object.
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

/**
 * CGMiner API "summary" response payload.
 * Based on Avalon Nano 3S fixture (cgminer 4.11.1).
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
 * Full CGMiner API response for the "summary" command.
 */
export interface SummaryResponse {
    /** Array of status objects */
    STATUS: CGMinerStatus[];
    /** Array containing the summary data (typically a single element) */
    SUMMARY: SummaryData[];
    /** Request id */
    id: number;
}
