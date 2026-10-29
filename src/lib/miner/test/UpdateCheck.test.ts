import { expect } from 'chai';
import { AvalonMiner } from '../miner/AvalonMiner';
import { BOS } from '../miner/BOS';
import { BOSMiner } from '../miner/BOSMiner';
import { CGMiner } from '../miner/CGMiner';
import { ClaymoreMiner } from '../miner/ClaymoreMiner';
import { IceRiverOcMiner } from '../miner/IceRiverOcMiner';
import { TeamRedMiner } from '../miner/TeamRedMiner';
import { XMRigMiner } from '../miner/XMRigMiner';
import { MinerFeatureKey } from '../model/MinerFeature';
import type { VersionResponse } from '../model/CGMinerApiTypes';
import type { UpdateSources } from '../../update/UpdateSources';
import versionFixture from '../fixture/nano3s-version.json';

/**
 * UpdateSources stand-in that records which lookups were made.
 *
 * @param latest - what each lookup returns (or a function that throws)
 * @param latest.github - latest tag per "owner/repo"
 * @param latest.braiins - latest build per platform directory
 * @param latest.avalon - latest Nano 3 build
 */
function fakeSources(latest: {
    github?: Record<string, string>;
    braiins?: Record<string, string> | (() => never);
    avalon?: string;
}): UpdateSources & { calls: string[] } {
    const calls: string[] = [];
    return {
        calls,
        githubLatestRelease: (owner: string, repo: string) => {
            calls.push(`github:${owner}/${repo}`);
            const tag = latest.github?.[`${owner}/${repo}`];
            return tag ? Promise.resolve(tag) : Promise.reject(new Error('no release'));
        },
        braiinsLatestBuild: (directory: string) => {
            calls.push(`braiins:${directory}`);
            if (typeof latest.braiins === 'function') {
                return Promise.reject(new Error('feed down'));
            }
            const build = latest.braiins?.[directory];
            return build ? Promise.resolve(build) : Promise.reject(new Error('unknown directory'));
        },
        avalonNano3LatestBuild: () => {
            calls.push('avalon:nano3');
            return latest.avalon ? Promise.resolve(latest.avalon) : Promise.reject(new Error('no file'));
        },
    } as unknown as UpdateSources & { calls: string[] };
}

/**
 * Runs `test` with the global fetch answering every request with the given JSON body.
 *
 * @param body - response body
 * @param test - the test to run
 */
async function withFetchReturning(body: unknown, test: () => Promise<void>): Promise<void> {
    const realFetch = globalThis.fetch;
    globalThis.fetch = () => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
    try {
        await test();
    } finally {
        globalThis.fetch = realFetch;
    }
}

const NEWEST_BOS_BUILD = '2026-09-23-0-d6cb014c-26.09.1-plus';

describe('update checks', () => {
    describe('Braiins OS (bos)', () => {
        /**
         * BOS miner with a fake API client.
         *
         * @param client - the methods the update check calls
         */
        function bosWithClient(client: object): BOS {
            const bos = new BOS({
                minerType: 'bos',
                host: '10.0.0.2',
                port: 50051,
                username: 'root',
                password: 'root',
                pollInterval: 10000,
            });
            (bos as unknown as { client: object }).client = client;
            return bos;
        }

        const details = (current: string, platform = 3): object => ({
            getMinerDetails: () => Promise.resolve({ bosVersion: { current }, platform }),
        });

        it('compares the installed build with the newest one of its control board', async () => {
            const sources = fakeSources({ braiins: { 'am3-bbb': NEWEST_BOS_BUILD } });
            const bos = bosWithClient({
                ...details('2023-05-29-0-1daef48b-23.03.2-plus'),
                getAutoUpgradeStatus: () =>
                    Promise.resolve({ enabled: true, nextExecution: { seconds: 1_800_000_000 } }),
            });

            const result = await bos.checkForUpdate(sources);

            expect(sources.calls).to.deep.equal(['braiins:am3-bbb']);
            expect(result).to.deep.equal({
                installedVersion: '2023-05-29-0-1daef48b-23.03.2-plus',
                latestVersion: NEWEST_BOS_BUILD,
                updateAvailable: true,
                autoUpgrade: { enabled: true, nextRun: 1_800_000_000_000 },
            });
        });

        it('is up to date on the newest build; a missing auto-upgrade flag means off', async () => {
            const bos = bosWithClient({
                ...details(NEWEST_BOS_BUILD),
                getAutoUpgradeStatus: () => Promise.resolve({}),
            });

            const result = await bos.checkForUpdate(fakeSources({ braiins: { 'am3-bbb': NEWEST_BOS_BUILD } }));

            expect(result.updateAvailable).to.equal(false);
            expect(result.autoUpgrade).to.deep.equal({ enabled: false, nextRun: undefined });
        });

        it('still reports the update status on firmware without the upgrade service', async () => {
            const bos = bosWithClient({
                ...details('2023-05-29-0-1daef48b-23.03.2-plus'),
                getAutoUpgradeStatus: () => Promise.reject(new Error('UNIMPLEMENTED')),
            });

            const result = await bos.checkForUpdate(fakeSources({ braiins: { 'am3-bbb': NEWEST_BOS_BUILD } }));

            expect(result.updateAvailable).to.equal(true);
            expect(result.autoUpgrade).to.be.undefined;
        });

        it('leaves the status unknown for a control board without a known feed', async () => {
            const sources = fakeSources({});
            const bos = bosWithClient({
                ...details(NEWEST_BOS_BUILD, 0),
                getAutoUpgradeStatus: () => Promise.resolve({ enabled: true }),
            });

            const result = await bos.checkForUpdate(sources);

            expect(sources.calls).to.deep.equal([]);
            expect(result.latestVersion).to.be.undefined;
            expect(result.updateAvailable).to.be.undefined;
        });

        it('fails when the feed lookup fails, rather than claiming anything', async () => {
            const bos = bosWithClient({
                ...details(NEWEST_BOS_BUILD),
                getAutoUpgradeStatus: () => Promise.resolve({}),
            });

            let failed = false;
            await bos.checkForUpdate(fakeSources({ braiins: () => undefined as never })).catch(() => (failed = true));
            expect(failed).to.equal(true);
        });
    });

    describe('XMRig', () => {
        const miner = (): XMRigMiner =>
            new XMRigMiner({ minerType: 'xmRig', host: '10.0.0.3', port: 8080, password: 'x', pollInterval: 10000 });

        it('compares the running version with the latest GitHub release', async () => {
            await withFetchReturning({ version: '6.21.0', hashrate: { total: [1] } }, async () => {
                const sources = fakeSources({ github: { 'xmrig/xmrig': 'v6.26.0' } });
                const result = await miner().checkForUpdate(sources);

                expect(sources.calls).to.deep.equal(['github:xmrig/xmrig']);
                expect(result).to.deep.equal({
                    installedVersion: '6.21.0',
                    latestVersion: '6.26.0',
                    updateAvailable: true,
                });
            });
        });

        it('is up to date on the latest release', async () => {
            await withFetchReturning({ version: '6.26.0', hashrate: { total: [1] } }, async () => {
                const result = await miner().checkForUpdate(fakeSources({ github: { 'xmrig/xmrig': 'v6.26.0' } }));
                expect(result.updateAvailable).to.equal(false);
            });
        });
    });

    describe('TeamRedMiner', () => {
        /**
         * TeamRedMiner whose Claymore-API reports the given version string.
         *
         * @param version - version string as reported over the Claymore API
         */
        function trmReporting(version: string): TeamRedMiner {
            const trm = new TeamRedMiner({
                minerType: 'teamRedMiner',
                host: '10.0.0.4',
                pollInterval: 10000,
                claymore: {
                    minerType: 'claymoreMiner',
                    host: '10.0.0.4',
                    port: 3333,
                    password: '',
                    pollInterval: 10000,
                },
                cgminer: { minerType: 'cgMiner', host: '10.0.0.4', port: 4028, pollInterval: 10000 },
            });
            (trm as unknown as { claymoreMiner: object }).claymoreMiner = {
                fetchStats: () => Promise.resolve({ version }),
                close: () => Promise.resolve(),
            };
            return trm;
        }

        it('takes the version number from the reported string', async () => {
            const sources = fakeSources({ github: { 'todxx/teamredminer': 'v0.10.21' } });
            const result = await trmReporting('0.10.20 - ETH').checkForUpdate(sources);

            expect(sources.calls).to.deep.equal(['github:todxx/teamredminer']);
            expect(result).to.deep.equal({
                installedVersion: '0.10.20',
                latestVersion: '0.10.21',
                updateAvailable: true,
            });
        });

        it('leaves the status unknown when the reported string has no version number', async () => {
            const result = await trmReporting('TeamRedMiner').checkForUpdate(
                fakeSources({ github: { 'todxx/teamredminer': 'v0.10.21' } }),
            );

            expect(result.installedVersion).to.equal('TeamRedMiner');
            expect(result.updateAvailable).to.be.undefined;
        });
    });

    describe('IceRiver OC firmware', () => {
        const miner = (): IceRiverOcMiner =>
            new IceRiverOcMiner({
                minerType: 'iceRiverOcMiner',
                host: '10.0.0.5',
                port: 443,
                password: 'token',
                pollInterval: 10000,
            });

        it('reads the firmware version from the overview and compares it with the latest release', async () => {
            await withFetchReturning({ error: 0, message: '', data: { softver1: 'pbv077c_ks0miner' } }, async () => {
                const sources = fakeSources({ github: { 'rdugan/iceriver-oc': 'v0.8.1' } });
                const result = await miner().checkForUpdate(sources);

                expect(sources.calls).to.deep.equal(['github:rdugan/iceriver-oc']);
                expect(result).to.deep.equal({
                    installedVersion: '0.7.7',
                    latestVersion: '0.8.1',
                    updateAvailable: true,
                });
            });
        });

        it('leaves the status unknown for a version outside the known naming scheme', async () => {
            await withFetchReturning({ error: 0, message: '', data: { softver1: 'custom_build' } }, async () => {
                const result = await miner().checkForUpdate(
                    fakeSources({ github: { 'rdugan/iceriver-oc': 'v0.8.1' } }),
                );

                expect(result.installedVersion).to.equal('custom_build');
                expect(result.updateAvailable).to.be.undefined;
            });
        });

        it('reports the firmware version during normal polling as info.version', async () => {
            await withFetchReturning({ error: 0, message: '', data: { softver1: 'pbv077c_ks0miner' } }, async () => {
                expect((await miner().fetchStats()).version).to.equal('pbv077c_ks0miner');
            });
        });
    });

    describe('Avalon', () => {
        const miner = new AvalonMiner({ minerType: 'avalonMiner', host: '10.0.0.6', port: 4028, pollInterval: 10000 });
        // real response of an Avalon Nano 3S: LVERSION 25021401_56abae7
        const nano3s = (versionFixture as unknown as VersionResponse).VERSION[0];

        it('compares a Nano 3S with the latest build in Canaan’s update file', async () => {
            const sources = fakeSources({ avalon: '25103101' });
            const result = await miner.checkVersionForUpdate(nano3s, sources);

            expect(sources.calls).to.deep.equal(['avalon:nano3']);
            expect(result).to.deep.equal({
                installedVersion: '25021401_56abae7',
                latestVersion: '25103101',
                updateAvailable: true,
            });
        });

        it('is up to date on the latest build', async () => {
            const result = await miner.checkVersionForUpdate(
                { ...nano3s, LVERSION: '25103101_1a2b3c4' },
                fakeSources({ avalon: '25103101' }),
            );
            expect(result.updateAvailable).to.equal(false);
        });

        it('does not look anything up for models the update file does not cover', async () => {
            const sources = fakeSources({ avalon: '25103101' });
            const result = await miner.checkVersionForUpdate({ ...nano3s, MODEL: 'Mini3' }, sources);

            expect(sources.calls).to.deep.equal([]);
            expect(result).to.deep.equal({ installedVersion: '25021401_56abae7' });
        });

        it('leaves the status unknown when the installed version is unreadable', async () => {
            const result = await miner.checkVersionForUpdate(
                { ...nano3s, LVERSION: 'unknown' },
                fakeSources({ avalon: '25103101' }),
            );
            expect(result.updateAvailable).to.be.undefined;
        });
    });

    describe('feature declarations', () => {
        const supportedNow = [
            new BOS({ minerType: 'bos', host: 'h', port: 1, username: 'u', password: 'p', pollInterval: 1000 }),
            new XMRigMiner({ minerType: 'xmRig', host: 'h', port: 1, password: '', pollInterval: 1000 }),
            new IceRiverOcMiner({ minerType: 'iceRiverOcMiner', host: 'h', port: 1, password: '', pollInterval: 1000 }),
            new AvalonMiner({ minerType: 'avalonMiner', host: 'h', port: 1, pollInterval: 1000 }),
        ];

        it('miners with a version source declare the update states', () => {
            for (const miner of supportedNow) {
                expect(miner.getSupportedFeatures(), miner.constructor.name).to.include.members([
                    MinerFeatureKey.latestVersion,
                    MinerFeatureKey.updateAvailable,
                ]);
            }
        });

        it('only Braiins OS declares the auto-upgrade states', () => {
            for (const miner of supportedNow) {
                const hasAutoUpgrade = miner.getSupportedFeatures().includes(MinerFeatureKey.autoUpgrade);
                expect(hasAutoUpgrade, miner.constructor.name).to.equal(miner instanceof BOS);
            }
        });

        it('shows the version the check compares: the firmware for BOS and Avalon, else the software', () => {
            expect(supportedNow.map(m => m.getInstalledVersionFeature())).to.deep.equal([
                MinerFeatureKey.firmwareVersion,
                MinerFeatureKey.version,
                MinerFeatureKey.version,
                MinerFeatureKey.firmwareVersion,
            ]);
        });

        it('miners without a source neither declare the states nor pretend to check', async () => {
            const unsupported = [
                new CGMiner({ minerType: 'cgMiner', host: 'h', port: 1, pollInterval: 1000 }),
                new ClaymoreMiner({ minerType: 'claymoreMiner', host: 'h', port: 1, password: '', pollInterval: 1000 }),
                new BOSMiner({
                    minerType: 'bosMiner',
                    host: 'h',
                    port: 1,
                    pollInterval: 1000,
                } as unknown as ConstructorParameters<typeof BOSMiner>[0]),
            ];
            for (const miner of unsupported) {
                expect(miner.getSupportedFeatures(), miner.constructor.name).to.not.include(
                    MinerFeatureKey.updateAvailable,
                );
                let rejected = false;
                await miner.checkForUpdate(fakeSources({})).catch(() => (rejected = true));
                expect(rejected, miner.constructor.name).to.equal(true);
            }
        });
    });
});
