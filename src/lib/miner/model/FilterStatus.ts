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
 * @param intervalDays - reminder interval from the device settings; 0 turns the reminder off (never due), undefined
 *  uses {@link DEFAULT_FILTER_CLEAN_INTERVAL_DAYS}
 * @returns whether cleaning is due
 */
export function isFilterCleanDue(runtimeMinutes: number, intervalDays: number | undefined): boolean {
    const interval = intervalDays ?? DEFAULT_FILTER_CLEAN_INTERVAL_DAYS;
    return interval > 0 && runtimeMinutes >= interval * MINUTES_PER_DAY;
}
