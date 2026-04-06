/**
 *
 * @param array - the array to deduplicate
 */
export function distinct<T>(array: T[]): T[] {
    return [...new Set(array)];
}
