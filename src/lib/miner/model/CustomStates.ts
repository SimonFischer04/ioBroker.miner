/**
 * Miner-specific values that have no generic {@link MinerFeatureKey} (yet), e.g. per-hashboard data of Braiins OS.
 *
 * Ids are relative to the device's `custom` channel and dot-separated (e.g. `hashboards.1.chipsCount`). Each segment
 * may only contain letters, digits, `_` and `-`. The structure may depend on the hardware (number of hashboards, ...),
 * so the adapter creates the objects when it first sees them.
 */
export interface CustomStates {
    /**
     * Channels to create, so the object tree has readable names. Parents must come before their children.
     */
    channels: CustomChannel[];
    /**
     * States with their current values.
     */
    states: CustomState[];
}

/**
 *
 */
export interface CustomChannel {
    /**
     * Relative id below the `custom` channel, e.g. `hashboards.1`.
     */
    id: string;
    /**
     * Display name.
     */
    name: string;
}

/**
 *
 */
export interface CustomState {
    /**
     * Relative id below the `custom` channel, e.g. `hashboards.1.chipsCount`.
     */
    id: string;
    /**
     * Display name.
     */
    name: string;
    /**
     * Value type.
     */
    type: 'number' | 'string' | 'boolean';
    /**
     * ioBroker state role, e.g. `value.temperature`. Defaults to a plain value / text.
     */
    role?: string;
    /**
     * Unit, e.g. `°C`.
     */
    unit?: string;
    /**
     * Current value. `null` if the miner did not report it.
     */
    val: number | string | boolean | null;
}
