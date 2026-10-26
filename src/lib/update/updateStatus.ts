/**
 * How the update status is shown: a translation key and a colour.
 */
export interface UpdateStatusDisplay {
    /**
     * Translation key of the status text.
     */
    text: 'Update available' | 'Up to date' | 'Unknown';
    /**
     * CSS colour of the status text.
     */
    color: 'orange' | 'green' | 'grey';
}

/**
 * Display for an `info.updateAvailable` value. Only an explicit `false` counts as up to date:
 * null or a missing value means the check failed or hasn't run yet.
 *
 * @param updateAvailable - current state value
 * @returns text key and colour
 */
export function describeUpdateStatus(updateAvailable: ioBroker.StateValue | undefined): UpdateStatusDisplay {
    if (updateAvailable === true) {
        return { text: 'Update available', color: 'orange' };
    }
    if (updateAvailable === false) {
        return { text: 'Up to date', color: 'green' };
    }
    return { text: 'Unknown', color: 'grey' };
}
