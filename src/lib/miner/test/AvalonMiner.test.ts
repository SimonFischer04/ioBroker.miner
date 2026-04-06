import { expect } from 'chai';
import { AvalonMiner, type SummaryVersionStatsResponse } from '../miner/AvalonMiner';
import summaryVersionStatsFixture from '../fixture/nano3s-summary+version+stats.json';

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
        it('should parse summary+version+stats fixture data correctly', () => {
            const fixture = summaryVersionStatsFixture as SummaryVersionStatsResponse;
            const stats = miner.parseSummaryVersionStatsResponse(fixture);

            // Base stats from summary+version (inherited from SGMiner)
            expect(stats.version).to.equal('4.11.1');
            expect(stats.firmwareVersion).to.equal('25021401_56abae7');
            expect(stats.totalHashrate).to.be.a('number');
            expect(stats.totalHashrate).to.be.closeTo(8263805.05 * 1_000_000, 1);
            expect(stats.acceptedShares).to.equal(188);
            expect(stats.rejectedShares).to.equal(0);

            // Power from Avalon MM ID telemetry: PS[0 0 27687 4 0 3678 131] → watt (index 6) = 131 W
            expect(stats.power).to.be.a('number');
            expect(stats.power).to.equal(131);

            // Efficiency: totalHashrate / power
            expect(stats.efficiency).to.be.a('number');
            expect(stats.efficiency).to.be.closeTo(stats.totalHashrate! / stats.power!, 1);

            // raw response preserved
            expect(stats.raw).to.equal(fixture);
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
});
