const HASHRATE_UNIT_FACTORS: Record<string, number> = {
    '': 1,
    k: 1e3,
    m: 1e6,
    g: 1e9,
    t: 1e12,
    p: 1e15,
    e: 1e18,
    z: 1e21,
};

/**
 * Convert a hashrate given in a unit like `Gh/s`, `TH/s` or `h/s` to H/s.
 *
 * @param value - the hashrate, as number or numeric string
 * @param unit - the unit the value is given in (case-insensitive)
 * @returns the hashrate in H/s, or undefined if the value or the unit can't be parsed
 */
export function toHashesPerSecond(value: unknown, unit: string | undefined): number | undefined {
    const parsed = parseNumber(value);
    const match = /^\s*([kmgtpez]?)h(?:\/s)?\s*$/i.exec(unit ?? '');
    if (parsed === undefined || !match) {
        return undefined;
    }
    return parsed * HASHRATE_UNIT_FACTORS[match[1].toLowerCase()];
}

/**
 * Parse a number that an API may send as number or as numeric string (e.g. BTC amounts like "0.00011940").
 *
 * @param value - the value to parse
 * @returns the number, or undefined if the value isn't a finite number
 */
export function parseNumber(value: unknown): number | undefined {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : undefined;
    }
    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
}

/**
 * Format a hashrate in H/s with a fitting unit, e.g. `27.98 TH/s`.
 *
 * @param hashesPerSecond - the hashrate in H/s
 */
export function formatHashrate(hashesPerSecond: number): string {
    const units = ['H/s', 'kH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s', 'ZH/s'];
    let value = hashesPerSecond;
    let index = 0;
    // compare the rounded value: 999999 H/s is "1 MH/s", not "1000 kH/s"
    while (Math.abs(Number(value.toFixed(2))) >= 1000 && index < units.length - 1) {
        value /= 1000;
        index++;
    }
    return `${Number(value.toFixed(2))} ${units[index]}`;
}
