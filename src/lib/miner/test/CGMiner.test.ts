import { expect } from 'chai';
import { CGMiner, type SummaryVersionResponse } from '../miner/CGMiner';
import summaryVersionFixture from '../fixture/nano3s-summary+version.json';

describe('CGMiner', () => {
    let miner: CGMiner;

    beforeEach(() => {
        miner = new CGMiner({
            minerType: 'cgMiner',
            host: '10.10.30.51',
            port: 4028,
            pollInterval: 10000,
        });
    });

    describe('parseSummaryVersionResponse', () => {
        it('should parse summary+version fixture data correctly', () => {
            const fixture = summaryVersionFixture as SummaryVersionResponse;
            const stats = miner.parseSummaryVersionResponse(fixture);

            expect(stats.version).to.equal('4.11.1');
            expect(stats.firmwareVersion).to.equal('25021401_56abae7');

            // totalHashrate: MHS 5s * 1_000_000 = 9894526.54 * 1_000_000
            expect(stats.totalHashrate).to.be.a('number');
            expect(stats.totalHashrate).to.be.closeTo(9894526.54 * 1_000_000, 1);

            // shares from summary
            expect(stats.acceptedShares).to.equal(4535);
            expect(stats.rejectedShares).to.equal(2);

            // raw response preserved
            expect(stats.raw).to.equal(fixture);
        });

        it('should handle missing data gracefully', () => {
            const empty: SummaryVersionResponse = {
                summary: [{ STATUS: [], SUMMARY: [], id: 1 }],
                version: [{ STATUS: [], VERSION: [], id: 1 }],
                id: 1,
            };

            const stats = miner.parseSummaryVersionResponse(empty);

            expect(stats.version).to.be.undefined;
            expect(stats.firmwareVersion).to.be.undefined;
            expect(stats.totalHashrate).to.be.undefined;
            expect(stats.acceptedShares).to.be.undefined;
            expect(stats.rejectedShares).to.be.undefined;
        });
    });
});
