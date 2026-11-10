import { expect } from 'chai';
import { createServer, type AddressInfo, type Server, type Socket } from 'node:net';
import { BOS, toHashboardValues } from '../miner/BOS';
import { isWithinPowerTargetConstraints } from '../miner/Miner';
import { BosApiClient, type BosHashboard } from '../api/BosApiClient';
import type { BOSSettings } from '../model/MinerSettings';

/**
 * The deadline the miner's gRPC client puts on its calls.
 *
 * @param settings - settings beyond the required ones
 */
function clientTimeoutMs(settings: Partial<BOSSettings>): number | undefined {
    const bos = new BOS({
        minerType: 'bos',
        host: '127.0.0.1',
        port: 50051,
        username: 'root',
        password: 'root',
        pollInterval: 10000,
        ...settings,
    });
    const client = (bos as unknown as { getClient(): BosApiClient }).getClient();
    const timeoutMs = Reflect.get(client, 'timeoutMs') as number | undefined;
    client.close();
    return timeoutMs;
}

describe('BOS', () => {
    describe('gRPC deadline', () => {
        it('uses the poll timeout when timeoutMs is not set, so a call to a hung miner cannot stay pending forever', () => {
            expect(clientTimeoutMs({ pollInterval: 10_000 })).to.equal(30_000);
            expect(clientTimeoutMs({ pollInterval: 60_000 })).to.equal(60_000);
        });

        it('keeps an explicitly configured timeoutMs', () => {
            expect(clientTimeoutMs({ timeoutMs: 5000 })).to.equal(5000);
        });

        it('ends a call to a miner that accepts the connection but never answers', async () => {
            const sockets: Socket[] = [];
            // accepts TCP connections, then stays silent - like a hung miner
            const server: Server = createServer(socket => sockets.push(socket));
            await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
            const client = new BosApiClient({
                host: '127.0.0.1',
                port: (server.address() as AddressInfo).port,
                timeoutMs: 300,
                username: 'root',
                password: 'root',
            });

            try {
                const startedAt = Date.now();
                const error = await client.login().catch((e: unknown) => e);

                expect(error).to.be.instanceOf(Error);
                expect(Date.now() - startedAt).to.be.lessThan(3000);
            } finally {
                client.close();
                sockets.forEach(s => s.destroy());
                await new Promise(resolve => server.close(resolve));
            }
        });
    });
});

describe('BOS power target', () => {
    /**
     * BOS miner with a fake API client.
     *
     * @param client - the API methods the test needs
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

    // PerformanceMode as grpc-js decodes it with oneofs: true
    const powerTargetMode = (watt: number): object => ({
        mode: 'tunerMode',
        tunerMode: { target: 'powerTarget', powerTarget: { powerTarget: { watt } } },
    });

    const pollClient = (performanceMode: () => Promise<object>): object => ({
        getMinerDetails: () => Promise.resolve({ bosVersion: { current: '26.09.1' } }),
        getMinerStats: () => Promise.resolve({}),
        getApiVersion: () => Promise.resolve({ major: 1, minor: 2, patch: 0 }),
        // Dynamic Performance Scaling currently runs the miner below the configured target
        getTunerState: () => Promise.resolve({ powerTargetModeState: { currentTarget: { watt: 2800 } } }),
        getActivePerformanceMode: performanceMode,
        getHashboards: () => Promise.resolve({ hashboards: [] }),
    });

    it('reports the configured power target, not the one Dynamic Performance Scaling currently applies', async () => {
        const stats = await bosWithClient(pollClient(() => Promise.resolve(powerTargetMode(3250)))).fetchStats();

        expect(stats.powerTarget).to.equal(3250);
        expect(stats.dynamicPowerTarget).to.equal(2800);
    });

    it('reports no power target in hashrate target mode', async () => {
        const hashrateMode = {
            mode: 'tunerMode',
            tunerMode: { target: 'hashrateTarget', hashrateTarget: { hashrateTarget: { terahashPerSecond: 100 } } },
        };

        const stats = await bosWithClient(pollClient(() => Promise.resolve(hashrateMode))).fetchStats();

        expect(stats.powerTarget).to.be.undefined;
    });

    it('still reports all other stats when the performance mode cannot be read', async () => {
        const stats = await bosWithClient(pollClient(() => Promise.reject(new Error('UNIMPLEMENTED')))).fetchStats();

        expect(stats.powerTarget).to.be.undefined;
        expect(stats.dynamicPowerTarget).to.equal(2800);
        expect(stats.firmwareVersion).to.equal('26.09.1');
    });

    it('reads the accepted power target range from the tuner constraints', async () => {
        const bos = bosWithClient({
            getConstraints: () =>
                Promise.resolve({
                    tunerConstraints: {
                        powerTarget: { default: { watt: 3250 }, min: { watt: 100 }, max: { watt: 4500 } },
                    },
                }),
        });

        expect(await bos.getPowerTargetConstraints()).to.deep.equal({ min: 100, max: 4500 });
    });

    it('reports no range when the miner has no power target constraints', async () => {
        const bos = bosWithClient({ getConstraints: () => Promise.resolve({ tunerConstraints: {} }) });

        expect(await bos.getPowerTargetConstraints()).to.be.undefined;
    });
});

describe('BOS hashboards', () => {
    // a Hashboard as grpc-js decodes it (defaults: false, so unset fields are missing)
    const board: BosHashboard = {
        id: '1',
        enabled: true,
        chipsCount: { value: 126 },
        chipType: 'BM1368',
        model: 'S21',
        boardName: 'BHB68601',
        serialNumber: 'HB123',
        currentVoltage: { volt: 13.2 },
        currentFrequency: { hertz: 525_000_000 },
        highestChipTemp: { temperature: { degreeC: 71.5 } },
        boardTemp: { degreeC: 60 },
        lowestInletTemp: { degreeC: 55 },
        highestOutletTemp: { degreeC: 70 },
        stats: {
            realHashrate: { last_5s: { gigahashPerSecond: 66_000 } },
            nominalHashrate: { gigahashPerSecond: 67_000 },
        },
    };

    /**
     * BOS miner whose API client returns the given hashboards.
     *
     * @param getHashboards - the client's GetHashboards call
     */
    function bosWithHashboards(getHashboards: () => Promise<object>): { bos: BOS; client: Record<string, unknown> } {
        const bos = new BOS({
            minerType: 'bos',
            host: '10.0.0.2',
            port: 50051,
            username: 'root',
            password: 'root',
            pollInterval: 10000,
        });
        const client: Record<string, unknown> = {
            getMinerDetails: () => Promise.resolve({ bosVersion: { current: '26.09.1' } }),
            getMinerStats: () => Promise.resolve({}),
            getApiVersion: () => Promise.resolve({ major: 1, minor: 2, patch: 0 }),
            getTunerState: () => Promise.resolve({}),
            getActivePerformanceMode: () => Promise.resolve({}),
            getHashboards,
        };
        (bos as unknown as { client: object }).client = client;
        return { bos, client };
    }

    it('reports chip count, chip type, temperatures, voltage, frequency and hashrate per board', () => {
        expect(toHashboardValues({ hashboards: [board] })).to.deep.equal({
            'hashboard1.enabled': true,
            'hashboard1.chipsCount': 126,
            'hashboard1.chipType': 'BM1368',
            'hashboard1.highestChipTemp': 71.5,
            'hashboard1.boardTemp': 60,
            'hashboard1.lowestInletTemp': 55,
            'hashboard1.highestOutletTemp': 70,
            'hashboard1.voltage': 13.2,
            'hashboard1.frequency': 525,
            'hashboard1.hashrate': 66_000_000_000_000,
            'hashboard1.nominalHashrate': 67_000_000_000_000,
            'hashboard1.model': 'S21',
            'hashboard1.boardName': 'BHB68601',
            'hashboard1.serialNumber': 'HB123',
        });
    });

    it('leaves out values a board does not report, and reports a missing enabled flag as disabled', () => {
        expect(toHashboardValues({ hashboards: [{ id: '3' }] })).to.deep.equal({ 'hashboard3.enabled': false });
    });

    it('reports the water temperatures of hydro-cooled boards', () => {
        const hydro = { ...board, lowestWaterInletTemp: { degreeC: 30 }, highestWaterOutletTemp: { degreeC: 40 } };

        expect(toHashboardValues({ hashboards: [hydro] })).to.include({
            'hashboard1.lowestWaterInletTemp': 30,
            'hashboard1.highestWaterOutletTemp': 40,
        });
    });

    it('declares the hashboard template up front and a channel per board once polled', async () => {
        const { bos } = bosWithHashboards(() => Promise.resolve({ hashboards: [board, { ...board, id: '2' }] }));

        expect(bos.getDynamicCustomChannels().map(c => c.id)).to.deep.equal(['hashboard']);
        expect(bos.getCustomChannels()).to.deep.equal([]);

        const stats = await bos.fetchStats();

        expect(bos.getCustomChannels().map(c => [c.id, c.label])).to.deep.equal([
            ['hashboard1', 'Hashboard 1'],
            ['hashboard2', 'Hashboard 2'],
        ]);
        // every reported value belongs to a declared feature
        const declared = bos.getCustomChannels().flatMap(c => c.features.map(f => `${c.id}.${f.id}`));
        expect(declared).to.include.members(Object.keys(stats.custom ?? {}));
        expect(stats.custom?.['hashboard2.chipsCount']).to.equal(126);
    });

    it('keeps the known boards and all other stats when the hashboards cannot be read', async () => {
        const { bos, client } = bosWithHashboards(() => Promise.resolve({ hashboards: [board] }));
        await bos.fetchStats();

        client.getHashboards = () => Promise.reject(new Error('UNIMPLEMENTED'));
        const stats = await bos.fetchStats();

        expect(stats.custom).to.be.undefined;
        expect(stats.firmwareVersion).to.equal('26.09.1');
        expect(bos.getCustomChannels().map(c => c.id)).to.deep.equal(['hashboard1']);
    });
});

describe('isWithinPowerTargetConstraints', () => {
    it('accepts the bounds themselves and everything between', () => {
        for (const watt of [100, 2000, 4500]) {
            expect(isWithinPowerTargetConstraints(watt, { min: 100, max: 4500 })).to.equal(true);
        }
    });

    it('rejects values outside the range', () => {
        expect(isWithinPowerTargetConstraints(99, { min: 100, max: 4500 })).to.equal(false);
        expect(isWithinPowerTargetConstraints(4501, { min: 100, max: 4500 })).to.equal(false);
    });

    it('does not restrict by an unknown bound', () => {
        expect(isWithinPowerTargetConstraints(1, { max: 4500 })).to.equal(true);
        expect(isWithinPowerTargetConstraints(99999, { min: 100 })).to.equal(true);
        expect(isWithinPowerTargetConstraints(1, undefined)).to.equal(true);
    });
});
