import { AvalonMiner } from '../miner/AvalonMiner';
import { expect, should } from 'chai';
import type { AvalonMinerSettings } from '../model/MinerSettings';
import { MinerFeatureKey } from '../model/MinerFeature';

describe('AvalonMiner', () => {
    let miner: AvalonMiner;

    beforeEach(() => {
        // Arrange
        const settings: AvalonMinerSettings = {
            minerType: 'avalonMiner',
            host: '192.168.1.100',
            port: 4028,
            pollInterval: 30000,
        };

        miner = new AvalonMiner(settings);
    });

    it('should create an AvalonMiner instance', () => {
        should().exist(miner);
        expect(miner).to.be.instanceOf(AvalonMiner);
    });

    it('should have correct settings', () => {
        expect(miner.settings.minerType).to.equal('avalonMiner');
        expect(miner.settings.host).to.equal('192.168.1.100');
        expect(miner.settings.port).to.equal(4028);
        expect(miner.settings.pollInterval).to.equal(30000);
    });

    it('should automatically generate an id if none is provided', () => {
        should().exist(miner.settings.id);
        miner.settings.id?.should.be.an('string');
        expect(miner.settings.id).to.have.length.above(0);
    });

    it('should support running and rawStats features', () => {
        const features = miner.getSupportedFeatures();
        expect(features).to.include(MinerFeatureKey.running);
        expect(features).to.include(MinerFeatureKey.rawStats);
    });

    it('should return correct logger name', () => {
        const loggerName = miner.getLoggerName();
        expect(loggerName).to.include('AvalonMiner');
        expect(loggerName).to.include('192.168.1.100');
        expect(loggerName).to.include('4028');
    });

    it('should return empty CLI args', () => {
        const cliArgs = miner.getCliArgs();
        expect(cliArgs).to.be.an('array');
        expect(cliArgs).to.have.lengthOf(0);
    });
});
