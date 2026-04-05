/**
 *
 */
export interface MinerStats {
    /**
     * Miner software version string.
     */
    version?: string;
    /**
     * Total hashrate in H/s.
     */
    totalHashrate?: number;
    /**
     * Current power consumption in watts.
     */
    power?: number;
    /**
     * Energy efficiency in H/W.
     */
    efficiency?: number;
    /**
     * Total number of accepted shares.
     */
    acceptedShares?: number;
    /**
     * Total number of rejected shares.
     */
    rejectedShares?: number;
    /**
     * Raw API response payload.
     */
    raw?: object;
}
