import type { Miner } from '../miner/miner/Miner';
import { MinerFeatureKey } from '../miner/model/MinerFeature';
import type { MinerSettings } from '../miner/model/MinerSettings';
import type { UpdateCheckResult } from '../miner/model/UpdateCheckResult';
import type { UpdateSources } from './UpdateSources';

/**
 * Outcome of one round of update checks.
 */
export interface UpdateCheckSummary {
    /**
     * Miners whose update check ran.
     */
    checked: number;
    /**
     * Miners with a newer version available.
     */
    updatesAvailable: number;
    /**
     * Miners whose check failed; their update state is unknown.
     */
    failed: number;
}

/**
 * Runs the update check of every miner that supports it, one after another.
 *
 * Each result is handed to `onResult`. When a check fails, `onResult` gets an empty result and the error,
 * so the caller resets the miner's update state to unknown instead of keeping an outdated answer.
 *
 * @param miners - the running miners
 * @param sources - shared upstream lookups
 * @param onResult - called once per checked miner
 * @returns how many miners were checked, have an update, or failed
 */
export async function runUpdateChecks(
    miners: readonly Miner<MinerSettings>[],
    sources: UpdateSources,
    onResult: (miner: Miner<MinerSettings>, result: UpdateCheckResult, error?: unknown) => Promise<void>,
): Promise<UpdateCheckSummary> {
    const summary: UpdateCheckSummary = { checked: 0, updatesAvailable: 0, failed: 0 };

    for (const miner of miners) {
        if (!miner.getSupportedFeatures().includes(MinerFeatureKey.updateAvailable)) {
            continue;
        }
        summary.checked++;

        let result: UpdateCheckResult;
        try {
            result = await miner.checkForUpdate(sources);
        } catch (e) {
            summary.failed++;
            await onResult(miner, {}, e);
            continue;
        }

        if (result.updateAvailable === true) {
            summary.updatesAvailable++;
        }
        await onResult(miner, result);
    }

    return summary;
}
