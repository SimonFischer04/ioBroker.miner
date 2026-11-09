import type { CustomFeatureValue } from './CustomFeature';

/**
 *
 */
export interface MinerStats {
    /**
     * Miner software version string.
     */
    version?: string;
    /**
     * Firmware version string (e.g. LVERSION from CGMiner API).
     */
    firmwareVersion?: string;
    /**
     * Total hashrate in H/s.
     */
    totalHashrate?: number;
    /**
     * Current power consumption in watts.
     */
    power?: number;
    /**
     * Current dynamic power target in watts.
     */
    dynamicPowerTarget?: number;
    /**
     * Configured power target in watts: what the power target control was set to, which Dynamic Performance Scaling
     * may lower temporarily (see {@link dynamicPowerTarget}).
     */
    powerTarget?: number;
    /**
     * Active performance profile, one of {@link Miner.getProfiles}: also when it was changed elsewhere (e.g. in the
     * miner's app).
     */
    profile?: string;
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
     * WiFi signal strength in dBm.
     */
    rssi?: number;
    /**
     * Values of the miner's custom features (see {@link Miner.getCustomChannels}), keyed by `<channel>.<feature>`.
     * Features that are missing keep their last value.
     */
    custom?: Record<string, CustomFeatureValue>;
    /**
     * Raw API response payload.
     */
    raw?: object;
}
