import {AvalonMiner} from '../miner/AvalonMiner';
import {expect} from 'chai';
import {AvalonMinerSettings} from '../model/MinerSettings';
import {MinerFeatureKey} from '../model/MinerFeature';

describe('Avalon Miner', () => {
    let miner: AvalonMiner;
    let settings: AvalonMinerSettings;

    beforeEach(() => {
        // Arrange
        settings = {
            minerType: 'avalonMiner',
            host: '192.168.1.100',
            port: 4028,
            pollInterval: 1000
        };

        miner = new AvalonMiner(settings);
    });

    it('should be instantiated with correct settings', () => {
        expect(miner.settings.minerType).to.equal('avalonMiner');
        expect(miner.settings.host).to.equal('192.168.1.100');
        expect(miner.settings.port).to.equal(4028);
        expect(miner.settings.pollInterval).to.equal(1000);
    });

    it('should automatically generate an id if none is provided', () => {
        expect(miner.settings.id).to.be.a('string');
        expect(miner.settings.id).to.have.length.above(0);
    });

    it('should support running and rawStats features', () => {
        const features = miner.getSupportedFeatures();
        expect(features).to.include(MinerFeatureKey.running);
        expect(features).to.include(MinerFeatureKey.rawStats);
    });

    it('should return empty CLI args', () => {
        const args = miner.getCliArgs();
        expect(args).to.be.an('array');
        expect(args).to.have.length(0);
    });

    it('should have the correct logger name format', () => {
        const loggerName = miner.getLoggerName();
        expect(loggerName).to.include('AvalonMiner');
        expect(loggerName).to.include(settings.host);
        expect(loggerName).to.include(settings.port.toString());
    });
});
