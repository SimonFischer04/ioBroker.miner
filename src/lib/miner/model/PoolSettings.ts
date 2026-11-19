export const poolTypeKeys = ['braiinsPool'] as const;

export type PoolType = (typeof poolTypeKeys)[number];

/**
 * Settings shared by all pool account types.
 */
export interface PoolSettings {
    /**
     * Which pool (and API) the account belongs to.
     */
    poolType: PoolType;
    /**
     * Id to uniquely identify this pool account.
     */
    id?: string;
    /**
     * Interval in milliseconds to poll the pool API for new data.
     */
    pollInterval: number;
}

/**
 * A Braiins Pool account, read via the pool's web API (https://academy.braiins.com/en/braiins-pool/monitoring/).
 */
export interface BraiinsPoolSettings extends PoolSettings {
    /**
     *
     */
    poolType: (typeof poolTypeKeys)[0];
    /**
     * Access token of an access profile with web API access (Braiins Pool: Settings → Access Profiles).
     */
    apiToken: string;
    /**
     * Base URL of the pool API. Defaults to https://pool.braiins.com.
     */
    baseUrl?: string;
}
