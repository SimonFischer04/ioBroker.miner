/**
 *
 * @param value
 */
export function safeParseInt(value: string): number {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Safely parse a string as a float, returning 0 if the value is not a valid number.
 *
 * @param value - string to parse
 */
export function safeParseFloat(value: string): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
}
