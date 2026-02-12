import { Miner } from '../miner/Miner';
import { expect, should } from 'chai';
import type { MinerSettings } from '../model/MinerSettings';
import type { MinerFeatureKey } from '../model/MinerFeature';

describe('Miner', () => {
    let miner: Miner<MinerSettings>;

    beforeEach(() => {
        // Arrange
        const settings = {
            minerType: '',
            host: '',
        };

        miner = new (class AnyMiner extends Miner<MinerSettings> {
            constructor() {
                super(settings);
            }

            public getSupportedFeatures(): MinerFeatureKey[] {
                return [];
            }

            public init(): Promise<void> {
                return Promise.resolve();
            }

            public start(): Promise<void> {
                return Promise.resolve();
            }

            public stop(): Promise<void> {
                return Promise.resolve();
            }

            public getCliArgs(): string[] {
                return [];
            }
        })();
    });

    it('automatically generates an id if none is provided', () => {
        should().exist(miner.settings.id);
        miner.settings.id?.should.be.an('string');
        expect(miner.settings.id).to.have.length.above(0);
    });
});
