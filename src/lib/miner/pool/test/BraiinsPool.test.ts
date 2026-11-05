import { expect } from 'chai';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import {
    BRAIINS_POOL_MIN_POLL_INTERVAL_MS,
    BraiinsPool,
    braiinsPoolThrottle,
    type BraiinsPoolProfileResponse,
    type BraiinsPoolWorkersResponse,
} from '../BraiinsPool';
import { createPool } from '../PoolFactory';
import { PoolManager } from '../PoolManager';
import type { PoolStats } from '../../model/PoolStats';

// samples from https://academy.braiins.com/en/braiins-pool/monitoring/
const profileSample: BraiinsPoolProfileResponse = {
    username: 'username',
    btc: {
        all_time_reward: '0.15000000',
        hash_rate_unit: 'Gh/s',
        hash_rate_5m: 27978,
        hash_rate_60m: 28191,
        hash_rate_24h: 28357,
        hash_rate_yesterday: 28197,
        low_workers: 0,
        off_workers: 0,
        ok_workers: 2,
        dis_workers: 2,
        current_balance: '0.15000000',
        today_reward: '0.000166667',
        estimated_reward: '0.00011940',
        shares_5m: 123,
        shares_60m: 1476,
        shares_24h: 35424,
        shares_yesterday: 0,
    },
};

const workersSample: BraiinsPoolWorkersResponse = {
    btc: {
        workers: {
            'username.worker1': {
                state: 'ok',
                last_share: 1542103204,
                hash_rate_unit: 'Gh/s',
                hash_rate_scoring: 15342,
                hash_rate_5m: 14977,
                hash_rate_60m: 15302,
                hash_rate_24h: 15351,
                shares_5m: 90304,
                shares_60m: 1125762,
                shares_24h: 20945364,
            },
            'username.worker2': {
                state: 'dis',
                last_share: 1542103200,
                hash_rate_unit: 'Gh/s',
                hash_rate_scoring: 12952,
                hash_rate_5m: '13001',
                hash_rate_60m: 12889,
                hash_rate_24h: 13006,
            },
        },
    },
};

function startServer(
    handler: (req: IncomingMessage, res: ServerResponse) => void,
): Promise<{ server: Server; baseUrl: string }> {
    return new Promise(resolve => {
        const server = createServer(handler);
        server.listen(0, '127.0.0.1', () =>
            resolve({ server, baseUrl: `http://127.0.0.1:${(server.address() as AddressInfo).port}` }),
        );
    });
}

function json(res: ServerResponse, status: number, body: unknown): void {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
}

describe('BraiinsPool', () => {
    let server: Server | undefined;
    let savedSpacing: number;

    before(() => {
        savedSpacing = braiinsPoolThrottle.minSpacingMs;
        braiinsPoolThrottle.minSpacingMs = 0;
    });

    after(() => {
        braiinsPoolThrottle.minSpacingMs = savedSpacing;
    });

    afterEach(async () => {
        server?.closeAllConnections();
        await new Promise(resolve => server?.close(resolve) ?? resolve(undefined));
        server = undefined;
    });

    describe('toPoolStats', () => {
        it('converts hashrates to H/s, BTC amounts to numbers and share times to ms', () => {
            const stats = BraiinsPool.toPoolStats(profileSample, workersSample);

            expect(stats).to.deep.include({
                username: 'username',
                hashrate5m: 27978e9,
                hashrate60m: 28191e9,
                hashrate24h: 28357e9,
                hashrateYesterday: 28197e9,
                workersOk: 2,
                workersLow: 0,
                workersOff: 0,
                workersDisabled: 2,
                currentBalance: 0.15,
                todayReward: 0.000166667,
                estimatedReward: 0.0001194,
                allTimeReward: 0.15,
            });
            expect(stats.workers).to.deep.equal([
                {
                    name: 'username.worker1',
                    state: 'ok',
                    lastShare: 1542103204000,
                    hashrateScoring: 15342e9,
                    hashrate5m: 14977e9,
                    hashrate60m: 15302e9,
                    hashrate24h: 15351e9,
                },
                {
                    name: 'username.worker2',
                    state: 'disabled',
                    lastShare: 1542103200000,
                    hashrateScoring: 12952e9,
                    hashrate5m: 13001e9,
                    hashrate60m: 12889e9,
                    hashrate24h: 13006e9,
                },
            ]);
            expect(stats.raw).to.deep.equal({ profile: profileSample, workers: workersSample });
        });

        it('handles an account without workers', () => {
            expect(BraiinsPool.toPoolStats(profileSample, {}).workers).to.deep.equal([]);
        });

        it('rejects a profile response without account data', () => {
            expect(() => BraiinsPool.toPoolStats({ username: 'x' }, workersSample)).to.throw(
                'unexpected profile response',
            );
        });
    });

    describe('fetchStats', () => {
        it('requests profile and workers with the API token', async () => {
            const requests: { url?: string; token?: string | string[] }[] = [];
            const started = await startServer((req, res) => {
                requests.push({ url: req.url, token: req.headers['pool-auth-token'] });
                json(res, 200, req.url?.startsWith('/accounts/profile') ? profileSample : workersSample);
            });
            server = started.server;

            const pool = new BraiinsPool({
                poolType: 'braiinsPool',
                pollInterval: 60_000,
                apiToken: 'secret-token',
                baseUrl: `${started.baseUrl}/`,
            });
            const stats = await pool.fetchStats();

            expect(requests).to.deep.equal([
                { url: '/accounts/profile/json/btc/', token: 'secret-token' },
                { url: '/accounts/workers/json/btc/', token: 'secret-token' },
            ]);
            expect(stats.hashrate5m).to.equal(27978e9);
            expect(stats.workers).to.have.length(2);
        });

        it('explains a rejected token', async () => {
            const started = await startServer((_req, res) => json(res, 401, { detail: 'unauthorized' }));
            server = started.server;

            const pool = new BraiinsPool({
                poolType: 'braiinsPool',
                pollInterval: 60_000,
                apiToken: 'wrong',
                baseUrl: started.baseUrl,
            });

            expect(((await pool.fetchStats().catch((e: unknown) => e)) as Error).message).to.contain(
                'rejected the API token (HTTP 401: {"detail":"unauthorized"})',
            );
        });

        it('fails on other HTTP errors', async () => {
            const started = await startServer((_req, res) => json(res, 500, {}));
            server = started.server;

            const pool = new BraiinsPool({
                poolType: 'braiinsPool',
                pollInterval: 60_000,
                apiToken: 'token',
                baseUrl: started.baseUrl,
            });

            expect(((await pool.fetchStats().catch((e: unknown) => e)) as Error).message).to.contain('HTTP 500');
        });
    });

    describe('polling', () => {
        it('raises a poll interval below the API minimum', () => {
            const pool = new BraiinsPool({ poolType: 'braiinsPool', pollInterval: 1000, apiToken: 'x' });
            expect(pool.getEffectivePollInterval()).to.equal(BRAIINS_POOL_MIN_POLL_INTERVAL_MS);

            const slower = new BraiinsPool({ poolType: 'braiinsPool', pollInterval: 120_000, apiToken: 'x' });
            expect(slower.getEffectivePollInterval()).to.equal(120_000);
        });

        it('polls right after init and reports the pool online', async () => {
            const started = await startServer((req, res) =>
                json(res, 200, req.url?.startsWith('/accounts/profile') ? profileSample : workersSample),
            );
            server = started.server;

            const manager = new PoolManager();
            const pool = await manager.init({
                poolType: 'braiinsPool',
                id: 'pool-1',
                pollInterval: 60_000,
                apiToken: 'token',
                baseUrl: started.baseUrl,
            } as Parameters<PoolManager['init']>[0]);

            try {
                const [stats, online] = await Promise.all([
                    new Promise<PoolStats>(resolve => pool.subscribeToStats(s => Promise.resolve(resolve(s)))),
                    new Promise<boolean>(resolve => pool.subscribeToOnlineStatus(o => Promise.resolve(resolve(o)))),
                ]);
                expect(online).to.equal(true);
                expect(stats.username).to.equal('username');
                expect(manager.hasPool('pool-1')).to.equal(true);
            } finally {
                await manager.closeAll();
            }
            expect(manager.hasPool('pool-1')).to.equal(false);
        });
    });

    it('is created by the pool factory', () => {
        expect(createPool({ poolType: 'braiinsPool', pollInterval: 60_000 })).to.be.instanceOf(BraiinsPool);
        expect(() => createPool({ poolType: 'unknown' as 'braiinsPool', pollInterval: 1 })).to.throw('not supported');
    });
});
