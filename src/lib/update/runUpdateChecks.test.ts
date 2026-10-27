import { expect } from 'chai';
import { runUpdateChecks } from './runUpdateChecks';
import { describeUpdateStatus } from './updateStatus';
import type { UpdateSources } from './UpdateSources';
import type { Miner } from '../miner/miner/Miner';
import type { MinerSettings } from '../miner/model/MinerSettings';
import { MinerFeatureKey } from '../miner/model/MinerFeature';
import type { UpdateCheckResult } from '../miner/model/UpdateCheckResult';

/**
 * Minimal miner stand-in: only what runUpdateChecks touches.
 *
 * @param name - id, for identifying it in assertions
 * @param check - what checkForUpdate does; undefined = miner without update support
 */
function fakeMiner(name: string, check?: () => Promise<UpdateCheckResult>): Miner<MinerSettings> {
    return {
        settings: { id: name },
        getSupportedFeatures: () =>
            check ? [MinerFeatureKey.latestVersion, MinerFeatureKey.updateAvailable] : [MinerFeatureKey.version],
        checkForUpdate: () => (check ? check() : Promise.reject(new Error('must not be called'))),
    } as unknown as Miner<MinerSettings>;
}

const sources = {} as UpdateSources;

describe('runUpdateChecks', () => {
    it('checks only miners that support it and counts the results', async () => {
        const seen: [string, UpdateCheckResult, unknown][] = [];
        const summary = await runUpdateChecks(
            [
                fakeMiner('outdated', () => Promise.resolve({ latestVersion: '2', updateAvailable: true })),
                fakeMiner('no-support'),
                fakeMiner('current', () => Promise.resolve({ latestVersion: '2', updateAvailable: false })),
                fakeMiner('unknown', () => Promise.resolve({ updateAvailable: undefined })),
            ],
            sources,
            (miner, result, error) => {
                seen.push([miner.settings.id!, result, error]);
                return Promise.resolve();
            },
        );

        expect(summary).to.deep.equal({ checked: 3, updatesAvailable: 1, failed: 0 });
        expect(seen.map(([id]) => id)).to.deep.equal(['outdated', 'current', 'unknown']);
    });

    it('reports a failed check with an empty result, so its state becomes unknown, and carries on', async () => {
        const seen: [string, UpdateCheckResult, unknown][] = [];
        const failure = new Error('feed down');
        const summary = await runUpdateChecks(
            [
                fakeMiner('broken', () => Promise.reject(failure)),
                fakeMiner('fine', () => Promise.resolve({ latestVersion: '2', updateAvailable: true })),
            ],
            sources,
            (miner, result, error) => {
                seen.push([miner.settings.id!, result, error]);
                return Promise.resolve();
            },
        );

        expect(summary).to.deep.equal({ checked: 2, updatesAvailable: 1, failed: 1 });
        expect(seen[0]).to.deep.equal(['broken', {}, failure]);
        expect(seen[1][0]).to.equal('fine');
        expect(seen[1][2]).to.be.undefined;
    });
});

describe('describeUpdateStatus', () => {
    it('only calls an explicit false "up to date"', () => {
        expect(describeUpdateStatus(true)).to.deep.equal({ text: 'Update available', color: 'orange' });
        expect(describeUpdateStatus(false)).to.deep.equal({ text: 'Up to date', color: 'green' });
    });

    it('shows a failed or missing check as unknown, never as up to date', () => {
        for (const value of [null, undefined]) {
            expect(describeUpdateStatus(value).text).to.equal('Unknown');
        }
    });
});
