import { expect } from 'chai';
import { createServer, type AddressInfo } from 'node:net';
import { AvalonMiner, type SummaryVersionStatsResponse } from '../miner/AvalonMiner';
import summaryVersionStatsFixture from '../fixture/nano3s-summary+version+stats.json';
import liteStatsFixture from '../fixture/nano3s-litestats.json';
import type { LiteStatsResponse } from '../model/CGMinerApiTypes';

/**
 * The summary+version+stats fixture with a litestats part joined in, as the combined request returns it.
 *
 * @param liteStats - the litestats part of the combined response
 */
function withLiteStats(liteStats: SummaryVersionStatsResponse['litestats']): SummaryVersionStatsResponse {
    return { ...(summaryVersionStatsFixture as SummaryVersionStatsResponse), litestats: liteStats };
}
import { MinerFeatureKey } from '../model/MinerFeature';

describe('AvalonMiner', () => {
    let miner: AvalonMiner;

    beforeEach(() => {
        miner = new AvalonMiner({
            minerType: 'avalonMiner',
            host: '10.10.30.51',
            port: 4028,
            pollInterval: 10000,
        });
    });

    describe('parseAvalonTelemetry', () => {
        it('should parse bracket-delimited key-value pairs', () => {
            const telemetry = 'Ver[Nano3s-25021401] FW[Release] OTemp[58] TMax[96] PS[0 0 27697 4 0 3678 132] MPO[133]';
            const result = miner.parseAvalonTelemetry(telemetry);

            expect(result.get('Ver')).to.equal('Nano3s-25021401');
            expect(result.get('FW')).to.equal('Release');
            expect(result.get('OTemp')).to.equal('58');
            expect(result.get('TMax')).to.equal('96');
            expect(result.get('PS')).to.equal('0 0 27697 4 0 3678 132');
            expect(result.get('MPO')).to.equal('133');
        });

        it('should handle empty string', () => {
            const result = miner.parseAvalonTelemetry('');
            expect(result.size).to.equal(0);
        });

        it('should handle values with spaces', () => {
            const result = miner.parseAvalonTelemetry('SYSTEMSTATU[Work: In Work, Hash Board: 1]');
            expect(result.get('SYSTEMSTATU')).to.equal('Work: In Work, Hash Board: 1');
        });

        it('should handle empty bracket values', () => {
            const result = miner.parseAvalonTelemetry('Key1[] Key2[value]');
            expect(result.get('Key1')).to.equal('');
            expect(result.get('Key2')).to.equal('value');
        });
    });

    describe('parseSummaryVersionStatsResponse', () => {
        it('should parse summary+version+stats+litestats fixture data correctly', () => {
            const fixture = withLiteStats([liteStatsFixture as LiteStatsResponse]);
            const stats = miner.parseSummaryVersionStatsResponse(fixture);

            // Base stats from summary+version (inherited from CGMiner)
            expect(stats.version).to.equal('4.11.1');
            expect(stats.firmwareVersion).to.equal('25021401_56abae7');
            expect(stats.totalHashrate).to.be.a('number');
            expect(stats.totalHashrate).to.be.closeTo(8263805.05 * 1_000_000, 1);
            expect(stats.acceptedShares).to.equal(188);
            expect(stats.rejectedShares).to.equal(0);

            // Power from Avalon MM ID telemetry: PS[0 0 27687 4 0 3678 131] → watt (index 6) = 131 W
            expect(stats.power).to.be.a('number');
            expect(stats.power).to.equal(131);

            // RSSI from litestats telemetry: RSSI[-55] → -55 dBm
            expect(stats.rssi).to.be.a('number');
            expect(stats.rssi).to.equal(-55);

            // filter runtime from litestats telemetry: Filter[33862] → 33862 minutes
            expect(stats.filterRuntime).to.equal(33862);

            // Efficiency: totalHashrate / power
            expect(stats.efficiency).to.be.a('number');
            if (stats.totalHashrate === undefined || stats.power === undefined) {
                throw new Error('Expected total hashrate and power to be parsed');
            }
            expect(stats.efficiency).to.be.closeTo(stats.totalHashrate / stats.power, 1);

            // raw response preserved
            expect(stats.raw).to.equal(fixture);
        });

        it('still parses everything else when the firmware does not know litestats', () => {
            // cgminer answers an unknown command within a combined request with just an error status for that part
            const fixture = withLiteStats([
                {
                    STATUS: [{ STATUS: 'E', When: 0, Code: 14, Msg: 'Invalid command', Description: 'cgminer 4.11.1' }],
                    id: 1,
                } as unknown as LiteStatsResponse,
            ]);

            const stats = miner.parseSummaryVersionStatsResponse(fixture);

            expect(stats.rssi).to.be.undefined;
            expect(stats.filterRuntime).to.be.undefined;
            expect(stats.power).to.equal(131);
            expect(stats.version).to.equal('4.11.1');
        });

        it('reports no filter runtime rather than 0 when the value is not a number', () => {
            const garbled = structuredClone(liteStatsFixture) as LiteStatsResponse;
            garbled.STATS[0]['MM ID0'] = garbled.STATS[0]['MM ID0'].replace('Filter[33862]', 'Filter[]');

            expect(miner.parseSummaryVersionStatsResponse(withLiteStats([garbled])).filterRuntime).to.be.undefined;
        });

        it('reports no RSSI rather than 0 when the value is not a number', () => {
            const garbled = structuredClone(liteStatsFixture) as LiteStatsResponse;
            garbled.STATS[0]['MM ID0'] = garbled.STATS[0]['MM ID0'].replace('RSSI[-55]', 'RSSI[]');

            expect(miner.parseSummaryVersionStatsResponse(withLiteStats([garbled])).rssi).to.be.undefined;
        });

        it('should handle missing stats data gracefully', () => {
            const noStats: SummaryVersionStatsResponse = {
                summary: [{ STATUS: [], SUMMARY: [], id: 1 }],
                version: [{ STATUS: [], VERSION: [], id: 1 }],
                stats: [{ STATUS: [], STATS: [], id: 1 }],
                id: 1,
            };

            const stats = miner.parseSummaryVersionStatsResponse(noStats);

            expect(stats.version).to.be.undefined;
            expect(stats.firmwareVersion).to.be.undefined;
            expect(stats.totalHashrate).to.be.undefined;
            expect(stats.power).to.be.undefined;
            expect(stats.efficiency).to.be.undefined;
            expect(stats.rssi).to.be.undefined;
        });

        it('should handle stats without MM ID field', () => {
            const noMmId: SummaryVersionStatsResponse = {
                summary: [{ STATUS: [], SUMMARY: [], id: 1 }],
                version: [{ STATUS: [], VERSION: [], id: 1 }],
                stats: [
                    {
                        STATUS: [],
                        STATS: [
                            {
                                STATS: 0,
                                ID: 'AVALON0',
                                Elapsed: 100,
                                Calls: 0,
                                Max: 0,
                                Min: 0,
                                Wait: 0,
                                'MM Count': 1,
                                'Nonce Mask': 25,
                                // No MM ID fields
                            },
                        ],
                        id: 1,
                    },
                ],
                id: 1,
            };

            const stats = miner.parseSummaryVersionStatsResponse(noMmId);
            expect(stats.power).to.be.undefined;
        });

        it('should handle MM ID telemetry without PS field', () => {
            const noPsField: SummaryVersionStatsResponse = {
                summary: [{ STATUS: [], SUMMARY: [], id: 1 }],
                version: [{ STATUS: [], VERSION: [], id: 1 }],
                stats: [
                    {
                        STATUS: [],
                        STATS: [
                            {
                                STATS: 0,
                                ID: 'AVALON0',
                                Elapsed: 100,
                                Calls: 0,
                                Max: 0,
                                Min: 0,
                                Wait: 0,
                                'MM Count': 1,
                                'Nonce Mask': 25,
                                'MM ID0': 'Ver[Nano3s] FW[Release] OTemp[58] MPO[133]',
                            },
                        ],
                        id: 1,
                    },
                ],
                id: 1,
            };

            const stats = miner.parseSummaryVersionStatsResponse(noPsField);
            expect(stats.power).to.be.undefined;
        });

        it('should handle PS field with zero power', () => {
            const zeroPower: SummaryVersionStatsResponse = {
                summary: [{ STATUS: [], SUMMARY: [], id: 1 }],
                version: [{ STATUS: [], VERSION: [], id: 1 }],
                stats: [
                    {
                        STATUS: [],
                        STATS: [
                            {
                                STATS: 0,
                                ID: 'AVALON0',
                                Elapsed: 100,
                                Calls: 0,
                                Max: 0,
                                Min: 0,
                                Wait: 0,
                                'MM Count': 1,
                                'Nonce Mask': 25,
                                'MM ID0': 'PS[0 0 0 0 0 0 0]',
                            },
                        ],
                        id: 1,
                    },
                ],
                id: 1,
            };

            const stats = miner.parseSummaryVersionStatsResponse(zeroPower);
            // Zero power should return undefined (miner likely not running)
            expect(stats.power).to.be.undefined;
        });
    });

    describe('getSupportedFeatures', () => {
        it('should include the profile feature', () => {
            const features = miner.getSupportedFeatures();
            expect(features).to.include(MinerFeatureKey.profile);
        });

        it('should include the rssi feature', () => {
            const features = miner.getSupportedFeatures();
            expect(features).to.include(MinerFeatureKey.rssi);
        });

        it('should include the filter features', () => {
            const features = miner.getSupportedFeatures();
            expect(features).to.include(MinerFeatureKey.filterRuntime);
            expect(features).to.include(MinerFeatureKey.filterCleanDue);
            expect(features).to.include(MinerFeatureKey.filterReset);
        });

        it('should not include cliArgs', () => {
            const features = miner.getSupportedFeatures();
            expect(features).to.not.include(MinerFeatureKey.cliArgs);
        });

        it('should include stats-related features from CGMiner base', () => {
            const features = miner.getSupportedFeatures();
            expect(features).to.include(MinerFeatureKey.version);
            expect(features).to.include(MinerFeatureKey.firmwareVersion);
            expect(features).to.include(MinerFeatureKey.stats);
            expect(features).to.include(MinerFeatureKey.rawStats);
        });
    });

    describe('getProfiles', () => {
        it('should return exactly three profiles', () => {
            expect(miner.getProfiles()).to.have.length(3);
        });

        it('should return low, medium, high', () => {
            const profiles = miner.getProfiles();
            expect(profiles).to.deep.equal(['low', 'medium', 'high']);
        });
    });
});

describe('AvalonMiner.fetchStats', () => {
    it('gets summary, version, stats and litestats in one combined request', async () => {
        const requests: string[] = [];
        const reply = JSON.stringify({
            ...(summaryVersionStatsFixture as SummaryVersionStatsResponse),
            litestats: [liteStatsFixture],
        });
        const server = createServer(socket => {
            socket.on('data', data => {
                requests.push((JSON.parse(data.toString()) as { command: string }).command);
                socket.end(reply);
            });
        });
        await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));

        try {
            const miner = new AvalonMiner({
                minerType: 'avalonMiner',
                host: '127.0.0.1',
                port: (server.address() as AddressInfo).port,
                pollInterval: 10000,
            });

            const stats = await miner.fetchStats();

            expect(requests).to.deep.equal(['summary+version+stats+litestats']);
            expect(stats.rssi).to.equal(-55);
            expect(stats.power).to.equal(131);
        } finally {
            await new Promise(resolve => server.close(resolve));
        }
    });
});

describe('AvalonMiner.resetFilter', () => {
    /**
     * Runs `resetFilter` against a fake cgminer API that answers every request with `reply`.
     *
     * @param reply - raw reply of the fake miner
     * @returns the requests the miner received, and the error resetFilter threw (if any)
     */
    async function resetFilterAgainst(
        reply: string,
    ): Promise<{ requests: { command: string; parameter: string }[]; error?: Error }> {
        const requests: { command: string; parameter: string }[] = [];
        const server = createServer(socket => {
            socket.on('data', data => {
                requests.push(JSON.parse(data.toString()) as { command: string; parameter: string });
                socket.end(reply);
            });
        });
        await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));

        try {
            const miner = new AvalonMiner({
                minerType: 'avalonMiner',
                host: '127.0.0.1',
                port: (server.address() as AddressInfo).port,
                pollInterval: 10000,
            });
            try {
                await miner.resetFilter();
                return { requests };
            } catch (e) {
                return { requests, error: e as Error };
            }
        } finally {
            await new Promise(resolve => server.close(resolve));
        }
    }

    it('sends filter-clean with the only value the firmware accepts', async () => {
        const { requests, error } = await resetFilterAgainst(
            JSON.stringify({
                STATUS: [{ STATUS: 'I', When: 0, Code: 118, Msg: 'ASC 0 set OK', Description: 'cgminer 4.11.1' }],
                id: 1,
            }),
        );

        expect(error).to.be.undefined;
        expect(requests).to.deep.equal([{ command: 'ascset', parameter: '0,filter-clean,1' }]);
    });

    it('rejects when the miner reports an error', async () => {
        const { error } = await resetFilterAgainst(
            JSON.stringify({
                STATUS: [{ STATUS: 'E', When: 0, Code: 120, Msg: 'Input param error.', Description: 'cgminer 4.11.1' }],
                id: 1,
            }),
        );

        expect(error?.message).to.equal('Input param error.');
    });
});
