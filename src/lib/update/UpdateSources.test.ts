import { expect } from 'chai';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
    AVALON_UPDATE_URL,
    braiinsPlatformDirectory,
    parseAvalonUpdateFile,
    parseBraiinsFeedListing,
    UpdateSources,
    type FetchFunction,
} from './UpdateSources';
import avalonUpdateFixture from './fixture/avalon-update.json';

// real listing of https://feeds.braiins-os.com/zynq-bm3-am2/ (trimmed to its newest rows)
const braiinsListing = readFileSync(path.join(__dirname, 'fixture/braiins-feed-zynq-bm3-am2.html'), 'utf8');

interface FakeRequest {
    url: string;
    init?: RequestInit;
}

/**
 * Fake `fetch` answering from a URL → response table and recording the requests.
 *
 * @param routes - response body (or a function returning a Response) per URL
 */
function fakeFetch(routes: Record<string, string | (() => Response)>): FetchFunction & { requests: FakeRequest[] } {
    const requests: FakeRequest[] = [];
    const fn = (url: string, init?: RequestInit): Promise<Response> => {
        requests.push({ url, init });
        const route = routes[url];
        if (route === undefined) {
            return Promise.resolve(new Response('not found', { status: 404 }));
        }
        return Promise.resolve(typeof route === 'function' ? route() : new Response(route, { status: 200 }));
    };
    return Object.assign(fn, { requests });
}

const BRAIINS_ZYNQ_URL = 'https://feeds.braiins-os.com/zynq-bm3-am2/';
const GITHUB_XMRIG_URL = 'https://api.github.com/repos/xmrig/xmrig/releases/latest';

describe('UpdateSources', () => {
    describe('braiinsPlatformDirectory', () => {
        it('maps every platform of the API to its feed directory', () => {
            // folder names as published on feeds.braiins-os.com
            expect([1, 2, 3, 4, 5, 6, 7, 8].map(braiinsPlatformDirectory)).to.deep.equal([
                'am1-s9',
                'am2-s17',
                'am3-bbb',
                'am3-aml',
                'stm32mp157c-ii1-am2',
                'cvitek-bm1-am2',
                'zynq-bm3-am2',
                'stm32mp157c-ii2-bmm1',
            ]);
        });

        it('accepts the enum name as well', () => {
            expect(braiinsPlatformDirectory('PLATFORM_ZYNQ_BM3_AM2')).to.equal('zynq-bm3-am2');
        });

        it('returns undefined for unspecified or unknown platforms', () => {
            expect(braiinsPlatformDirectory(0)).to.be.undefined;
            expect(braiinsPlatformDirectory(99)).to.be.undefined;
            expect(braiinsPlatformDirectory('PLATFORM_NOT_A_BOARD')).to.be.undefined;
            expect(braiinsPlatformDirectory(undefined)).to.be.undefined;
        });
    });

    describe('parseBraiinsFeedListing', () => {
        it('lists each firmware image once, ignoring .ipk packages and checksums', () => {
            expect(parseBraiinsFeedListing(braiinsListing)).to.deep.equal([
                '2026-08-20-0-33fea20e-26.08.1-plus',
                '2026-09-11-0-7a758742-26.09-plus',
                '2026-09-23-0-d6cb014c-26.09.1-plus',
            ]);
        });

        it('understands the sd-firmware images of SD-card based boards', () => {
            const row =
                '<a href="sd-firmware_2026-09-23-0-d6cb014c-26.09.1-plus_omap.tar">x</a>' +
                '<a href="sd-firmware_2026-09-23-0-d6cb014c-26.09.1-plus_omap.tar.checksum">x</a>';
            expect(parseBraiinsFeedListing(row)).to.deep.equal(['2026-09-23-0-d6cb014c-26.09.1-plus']);
        });
    });

    describe('parseAvalonUpdateFile', () => {
        it('reads the Nano 3 / 3S version from the real update file', () => {
            expect(parseAvalonUpdateFile(avalonUpdateFixture)).to.equal('25103101');
        });

        it('rejects files without a valid nano3 version', () => {
            expect(parseAvalonUpdateFile({ knode: { version: '26100800' } })).to.be.undefined;
            expect(parseAvalonUpdateFile({ nano3: { version: 'latest' } })).to.be.undefined;
            expect(parseAvalonUpdateFile({ nano3: { version: 25103101 } })).to.be.undefined;
            expect(parseAvalonUpdateFile(null)).to.be.undefined;
        });
    });

    describe('lookups', () => {
        it('braiinsLatestBuild returns the newest build of the platform directory', async () => {
            const fetch = fakeFetch({ [BRAIINS_ZYNQ_URL]: braiinsListing });
            const sources = new UpdateSources({ fetch });

            expect(await sources.braiinsLatestBuild('zynq-bm3-am2')).to.equal('2026-09-23-0-d6cb014c-26.09.1-plus');
            expect(fetch.requests.map(r => r.url)).to.deep.equal([BRAIINS_ZYNQ_URL]);
        });

        it('braiinsLatestBuild compares build counters numerically', async () => {
            const listing =
                '<a href="firmware_2026-09-23-10-bbbbbbbb-26.09.1-plus_arm.tar">x</a>' +
                '<a href="firmware_2026-09-23-2-aaaaaaaa-26.09.1-plus_arm.tar">x</a>';
            const sources = new UpdateSources({ fetch: fakeFetch({ [BRAIINS_ZYNQ_URL]: listing }) });

            expect(await sources.braiinsLatestBuild('zynq-bm3-am2')).to.equal('2026-09-23-10-bbbbbbbb-26.09.1-plus');
        });

        it('braiinsLatestBuild picks the highest release, not a backport built later', async () => {
            // real file names from the am2-s17 directory, plus a backport built after the newest release
            const listing = [
                'sd-firmware_2024-09-12-0-4821d892-24.06.2-plus_arm_cortex-a9_neon.tar',
                'sd-firmware_2024-09-12-0-89ae7f26-24.08.1-plus_arm_cortex-a9_neon.tar',
                'sd-firmware_2025-02-21-0-e05df053-25.01-plus_arm_cortex-a9_neon.tar',
                'sd-firmware_2024-09-12-0-9dbf0134-24.04.3-plus_arm_cortex-a9_neon.tar',
                'sd-firmware_2025-06-01-0-cccccccc-24.09.2-plus_arm_cortex-a9_neon.tar',
            ]
                .map(name => `<a href="${name}">x</a>`)
                .join('');
            const url = 'https://feeds.braiins-os.com/am2-s17/';
            const sources = new UpdateSources({ fetch: fakeFetch({ [url]: listing }) });

            expect(await sources.braiinsLatestBuild('am2-s17')).to.equal('2025-02-21-0-e05df053-25.01-plus');
        });

        it('braiinsLatestBuild fails when the listing has no firmware', async () => {
            const sources = new UpdateSources({ fetch: fakeFetch({ [BRAIINS_ZYNQ_URL]: '<html></html>' }) });

            await expectRejection(sources.braiinsLatestBuild('zynq-bm3-am2'), /no firmware/);
        });

        it('avalonNano3LatestBuild reads Canaan’s update file', async () => {
            const fetch = fakeFetch({ [AVALON_UPDATE_URL]: JSON.stringify(avalonUpdateFixture) });
            const sources = new UpdateSources({ fetch });

            expect(await sources.avalonNano3LatestBuild()).to.equal('25103101');
            expect(fetch.requests[0].url).to.equal(AVALON_UPDATE_URL);
        });

        it('githubLatestRelease returns the tag of the latest release', async () => {
            const fetch = fakeFetch({ [GITHUB_XMRIG_URL]: JSON.stringify({ tag_name: 'v6.26.0', draft: false }) });
            const sources = new UpdateSources({ fetch });

            expect(await sources.githubLatestRelease('xmrig', 'xmrig')).to.equal('v6.26.0');
        });

        it('sends a User-Agent (GitHub rejects requests without one) and a timeout', async () => {
            const fetch = fakeFetch({ [GITHUB_XMRIG_URL]: JSON.stringify({ tag_name: 'v6.26.0' }) });
            await new UpdateSources({ fetch }).githubLatestRelease('xmrig', 'xmrig');

            const init = fetch.requests[0].init;
            expect((init?.headers as Record<string, string>)['User-Agent']).to.equal('ioBroker.miner');
            expect(init?.signal).to.be.instanceOf(AbortSignal);
        });

        it('fails on an HTTP error instead of returning a result', async () => {
            const sources = new UpdateSources({
                fetch: fakeFetch({ [GITHUB_XMRIG_URL]: () => new Response('rate limited', { status: 403 }) }),
            });

            await expectRejection(sources.githubLatestRelease('xmrig', 'xmrig'), /HTTP 403/);
        });

        it('fails when the release has no tag', async () => {
            const sources = new UpdateSources({ fetch: fakeFetch({ [GITHUB_XMRIG_URL]: JSON.stringify({}) }) });

            await expectRejection(sources.githubLatestRelease('xmrig', 'xmrig'), /no tag/);
        });
    });

    describe('cache', () => {
        const release = (): string => JSON.stringify({ tag_name: 'v6.26.0' });

        it('reuses a successful lookup', async () => {
            const fetch = fakeFetch({ [GITHUB_XMRIG_URL]: release() });
            const sources = new UpdateSources({ fetch });

            await sources.githubLatestRelease('xmrig', 'xmrig');
            await sources.githubLatestRelease('xmrig', 'xmrig');

            expect(fetch.requests).to.have.length(1);
        });

        it('shares one request between concurrent callers', async () => {
            const fetch = fakeFetch({ [GITHUB_XMRIG_URL]: release() });
            const sources = new UpdateSources({ fetch });

            await Promise.all([
                sources.githubLatestRelease('xmrig', 'xmrig'),
                sources.githubLatestRelease('xmrig', 'xmrig'),
            ]);

            expect(fetch.requests).to.have.length(1);
        });

        it('asks again once the cached result expired', async () => {
            let now = 0;
            const fetch = fakeFetch({ [GITHUB_XMRIG_URL]: release() });
            const sources = new UpdateSources({ fetch, cacheTtlMs: 1000, now: () => now });

            await sources.githubLatestRelease('xmrig', 'xmrig');
            now = 999;
            await sources.githubLatestRelease('xmrig', 'xmrig');
            expect(fetch.requests).to.have.length(1);

            now = 1000;
            await sources.githubLatestRelease('xmrig', 'xmrig');
            expect(fetch.requests).to.have.length(2);
        });

        it('does not cache a failure, so the next call retries', async () => {
            let calls = 0;
            const fetch = fakeFetch({
                [GITHUB_XMRIG_URL]: () =>
                    ++calls === 1 ? new Response('down', { status: 503 }) : new Response(release(), { status: 200 }),
            });
            const sources = new UpdateSources({ fetch });

            await expectRejection(sources.githubLatestRelease('xmrig', 'xmrig'), /HTTP 503/);
            expect(await sources.githubLatestRelease('xmrig', 'xmrig')).to.equal('v6.26.0');
            expect(fetch.requests).to.have.length(2);
        });

        it('clearCache makes the next call ask again', async () => {
            const fetch = fakeFetch({ [GITHUB_XMRIG_URL]: release() });
            const sources = new UpdateSources({ fetch });

            await sources.githubLatestRelease('xmrig', 'xmrig');
            sources.clearCache();
            await sources.githubLatestRelease('xmrig', 'xmrig');

            expect(fetch.requests).to.have.length(2);
        });

        it('keeps separate entries per source', async () => {
            const fetch = fakeFetch({
                [GITHUB_XMRIG_URL]: release(),
                'https://api.github.com/repos/todxx/teamredminer/releases/latest': JSON.stringify({
                    tag_name: 'v0.10.21',
                }),
            });
            const sources = new UpdateSources({ fetch });

            expect(await sources.githubLatestRelease('xmrig', 'xmrig')).to.equal('v6.26.0');
            expect(await sources.githubLatestRelease('todxx', 'teamredminer')).to.equal('v0.10.21');
        });
    });
});

/**
 * Asserts that a promise rejects with a message matching the pattern.
 *
 * @param promise - the promise expected to reject
 * @param pattern - expected error message pattern
 */
async function expectRejection(promise: Promise<unknown>, pattern: RegExp): Promise<void> {
    try {
        await promise;
    } catch (e) {
        expect((e as Error).message).to.match(pattern);
        return;
    }
    expect.fail('expected the promise to reject');
}
