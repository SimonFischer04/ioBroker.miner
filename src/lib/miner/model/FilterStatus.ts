/**
 * Days of filter runtime after which the dust filter reminder fires when the device settings don't set an interval.
 * Canaan doesn't publish the interval its app uses; a month is a common cleaning interval for dust filters.
 */
export const DEFAULT_FILTER_CLEAN_INTERVAL_DAYS = 30;

const MINUTES_PER_DAY = 24 * 60;

/**
 * Whether the dust filter is due for cleaning.
 *
 * @param runtimeMinutes - filter runtime since the last reset, as reported by the miner
 * @param intervalDays - reminder interval from the device settings; 0 turns the reminder off, undefined uses
 *  {@link DEFAULT_FILTER_CLEAN_INTERVAL_DAYS}
 * @returns true / false, or undefined if unknown (no runtime reported) or the reminder is off
 */
export function isFilterCleanDue(
    runtimeMinutes: number | undefined,
    intervalDays: number | undefined,
): boolean | undefined {
    const interval = intervalDays ?? DEFAULT_FILTER_CLEAN_INTERVAL_DAYS;
    if (runtimeMinutes === undefined || !Number.isFinite(runtimeMinutes) || !(interval > 0)) {
        return undefined;
    }
    return runtimeMinutes >= interval * MINUTES_PER_DAY;
}

/**
 * Formats a filter runtime for display, e.g. `23 d 12 h`.
 *
 * @param runtimeMinutes - filter runtime in minutes
 * @returns the runtime in days and hours
 */
export function formatFilterRuntime(runtimeMinutes: number): string {
    const totalHours = Math.floor(Math.max(0, runtimeMinutes) / 60);
    return `${Math.floor(totalHours / 24)} d ${totalHours % 24} h`;
}
