/**
 *
 * @param array
 */
export function distinct<T>(array: T[]): T[] {
    return [...new Set(array)];
}
