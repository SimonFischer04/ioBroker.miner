/**
 * Result of {@link Miner.checkForUpdate}.
 */
export interface UpdateCheckResult {
    /**
     * Version installed on the miner, in the format the miner reports it.
     */
    installedVersion?: string;
    /**
     * Latest version available upstream. Undefined if no source covers this device (e.g. an unsupported model).
     */
    latestVersion?: string;
    /**
     * Whether the latest version is newer than the installed one. Undefined means unknown.
     */
    updateAvailable?: boolean;
    /**
     * Braiins OS only: the miner's own automatic upgrade setting.
     */
    autoUpgrade?: {
        /**
         * Whether the miner upgrades itself automatically.
         */
        enabled: boolean;
        /**
         * Next scheduled automatic upgrade run (ms since epoch), if scheduled.
         */
        nextRun?: number;
    };
}

/**
 * Builds an {@link UpdateCheckResult} from the installed and latest version and how they compare.
 *
 * @param installedVersion - version installed on the miner
 * @param latestVersion - latest version available upstream
 * @param comparison - result of comparing installed to latest (negative = older), undefined if they couldn't be compared
 * @returns the result; `updateAvailable` stays undefined when the versions couldn't be compared
 */
export function toUpdateCheckResult(
    installedVersion: string | undefined,
    latestVersion: string | undefined,
    comparison: number | undefined,
): UpdateCheckResult {
    return {
        installedVersion,
        latestVersion,
        updateAvailable: comparison === undefined ? undefined : comparison < 0,
    };
}
