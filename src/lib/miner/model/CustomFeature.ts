/**
 * Custom features: things a single miner type can do that are not (yet) standardised across miners, like the LED
 * ring of an Avalon Nano. A miner describes them via {@link Miner.getCustomChannels}; the adapter then creates,
 * fills and handles their states generically under `<device>.custom.<channel>.<feature>`.
 *
 * Once a second miner type supports the same thing, it should be promoted to a regular {@link MinerFeatureKey}
 * (with a migration removing the old `custom.*` state) instead of being duplicated here.
 */

/**
 * Value of a custom feature, as reported in {@link MinerStats.custom} and accepted by {@link Miner.setCustomFeature}.
 */
export type CustomFeatureValue = boolean | number | string;

/**
 * Name of the channel all custom feature channels live in.
 */
export const CUSTOM_CHANNEL = 'custom';

/**
 * A single custom feature, i.e. one state.
 */
export interface CustomFeatureDefinition {
    /**
     * Id relative to its channel, e.g. `brightness`. No dots.
     */
    id: string;
    /**
     * Short human-readable name.
     */
    label: string;
    /**
     * What the value means.
     */
    description: string;
    /**
     * Value type.
     */
    type: 'boolean' | 'number' | 'string';
    /**
     * TODO: how to handle this when moving to lib (see MinerFeatureProperties.role)
     * ioBroker state role (e.g. 'switch.light', 'level.dimmer', 'level.color.rgb').
     */
    role?: string;
    /**
     * Unit of a number.
     */
    unit?: string;
    /**
     * Lowest accepted number.
     */
    min?: number;
    /**
     * Highest accepted number.
     */
    max?: number;
    /**
     * Step between accepted numbers.
     */
    step?: number;
    /**
     * The only accepted values, mapped to their labels. Shown as a dropdown.
     */
    states?: Record<string, string>;
    /**
     * Whether the miner reports the value.
     */
    readable: boolean;
    /**
     * Whether the value can be changed.
     */
    writable: boolean;
    /**
     * Considered advanced, e.g. hidden in the UI by default (sets the "expert" flag in ioBroker).
     */
    advanced?: boolean;
    /**
     * For a readable boolean: raise a notification when the miner reports it turning true (e.g. maintenance due).
     */
    notification?: CustomFeatureNotification;
}

/**
 * A notification raised when a boolean custom feature turns true.
 */
export interface CustomFeatureNotification {
    /**
     * Notification category, as declared for the adapter (in ioBroker: `notifications` in io-package.json).
     */
    category: string;
    /**
     * What happened and what to do, in English. The adapter adds the device name.
     */
    message: string;
}

/**
 * A group of related custom features, e.g. `light`. Becomes a sub-channel of {@link CUSTOM_CHANNEL}.
 */
export interface CustomChannelDefinition {
    /**
     * Id of the channel, e.g. `light`. No dots.
     */
    id: string;
    /**
     * Short human-readable name.
     */
    label: string;
    /**
     * The features in this channel.
     */
    features: CustomFeatureDefinition[];
}

/**
 * A template for custom channels a miner only knows once it has talked to the hardware, e.g. one channel per hashboard.
 * The miner declares the template up front ({@link Miner.getDynamicCustomChannels}) and returns an instance per
 * detected unit from {@link Miner.getCustomChannels} (see {@link instantiateDynamicCustomChannel}). The adapter creates
 * an instance's objects when it first appears, and keeps them while the miner isn't polled yet, e.g. after a restart.
 */
export interface DynamicCustomChannelDefinition {
    /**
     * Prefix of the channel ids, e.g. `hashboard`: instance `1` becomes channel `hashboard1`. No dots.
     */
    id: string;
    /**
     * Prefix of the channel labels, e.g. `Hashboard`: instance `1` becomes `Hashboard 1`.
     */
    label: string;
    /**
     * The features of every instance.
     */
    features: CustomFeatureDefinition[];
}

/**
 * The channel of one instance of a dynamic channel template.
 *
 * @param template - the template
 * @param instance - id of the instance as the miner reports it, e.g. a hashboard id. Characters other than letters,
 *     digits, `_` and `-` are replaced, so it can't create extra levels or invalid object ids.
 */
export function instantiateDynamicCustomChannel(
    template: DynamicCustomChannelDefinition,
    instance: string,
): CustomChannelDefinition {
    return {
        id: `${template.id}${instance.replace(/[^A-Za-z0-9_-]/g, '_')}`,
        label: `${template.label} ${instance}`,
        features: template.features,
    };
}

/**
 * The template a channel id is an instance of, if any.
 *
 * @param templates - the dynamic channel templates a miner declares
 * @param channelId - a channel id below {@link CUSTOM_CHANNEL}, e.g. `hashboard1`
 */
export function findDynamicCustomChannel(
    templates: readonly DynamicCustomChannelDefinition[],
    channelId: string,
): DynamicCustomChannelDefinition | undefined {
    return templates.find(
        template =>
            channelId.length > template.id.length &&
            channelId.startsWith(template.id) &&
            /^[A-Za-z0-9_-]+$/.test(channelId.slice(template.id.length)),
    );
}

/**
 * A custom feature together with its channel and its id relative to {@link CUSTOM_CHANNEL}.
 */
export interface ResolvedCustomFeature {
    /**
     * `<channel>.<feature>`, e.g. `light.brightness`: the key in {@link MinerStats.custom}.
     */
    id: string;
    /**
     * The channel the feature belongs to.
     */
    channel: CustomChannelDefinition;
    /**
     * The feature itself.
     */
    feature: CustomFeatureDefinition;
}

/**
 * All features of the given channels, with their ids relative to {@link CUSTOM_CHANNEL}.
 *
 * @param channels - the channels a miner declares
 */
export function resolveCustomFeatures(channels: readonly CustomChannelDefinition[]): ResolvedCustomFeature[] {
    return channels.flatMap(channel =>
        channel.features.map(feature => ({ id: `${channel.id}.${feature.id}`, channel, feature })),
    );
}

/**
 * Checks a value written to a custom feature against its definition and converts it to the feature's type.
 *
 * @param feature - the feature definition
 * @param value - the value written, e.g. a state value
 * @returns the value in the feature's type
 * @throws {Error} if the feature isn't writable or the value isn't accepted
 */
export function coerceCustomFeatureValue(feature: CustomFeatureDefinition, value: unknown): CustomFeatureValue {
    if (!feature.writable) {
        throw new Error(`${feature.label} is read-only`);
    }

    let coerced: CustomFeatureValue;
    switch (feature.type) {
        case 'boolean': {
            if (typeof value === 'boolean') {
                coerced = value;
            } else if (value === 1 || value === 0 || value === 'true' || value === 'false') {
                coerced = value === 1 || value === 'true';
            } else {
                throw new Error(`${feature.label} expects true or false, got ${JSON.stringify(value)}`);
            }
            break;
        }
        case 'number': {
            const num = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
            if (!Number.isFinite(num) || (typeof value === 'string' && value.trim() === '')) {
                throw new Error(`${feature.label} expects a number, got ${JSON.stringify(value)}`);
            }
            if ((feature.min !== undefined && num < feature.min) || (feature.max !== undefined && num > feature.max)) {
                throw new Error(
                    `${feature.label} must be between ${feature.min ?? '-∞'} and ${feature.max ?? '∞'}, got ${num}`,
                );
            }
            coerced = num;
            break;
        }
        case 'string': {
            if (typeof value !== 'string') {
                throw new Error(`${feature.label} expects a text, got ${JSON.stringify(value)}`);
            }
            coerced = value;
            break;
        }
    }

    if (feature.states && !Object.keys(feature.states).includes(String(coerced))) {
        throw new Error(
            `${feature.label} must be one of ${Object.keys(feature.states).join(', ')}, got ${JSON.stringify(value)}`,
        );
    }
    return coerced;
}
