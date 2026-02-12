/**
 *
 * @param enumType
 */
export function getEnumKeyNames<T extends object>(enumType: T): string[] {
    return Object.keys(enumType).filter(x => !(parseInt(x, 10) >= 0));
}
