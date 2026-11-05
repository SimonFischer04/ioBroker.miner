import { expect } from 'chai';
import { PoolFeatureKey } from '../lib/miner/model/PoolFeature';
import {
    getPoolStateObjects,
    getPoolStateValues,
    getWorkerObjectId,
    getWorkerStateObjects,
    getWorkerStateValues,
} from './poolStates';

describe('poolStates', () => {
    it('creates only the states of supported features, plus the info states', () => {
        const ids = Object.keys(getPoolStateObjects([PoolFeatureKey.hashrate]));
        expect(ids).to.include.members(['info.poolType', 'info.online', 'info.lastSeen', 'stats.hashrate5m']);
        expect(ids).not.to.include('rewards.currentBalance');
        expect(ids).not.to.include('raw.stats');
    });

    it('writes the reported values of supported features only', () => {
        const values = getPoolStateValues({ username: 'me', hashrate5m: 1e12, currentBalance: 0.5, raw: { a: 1 } }, [
            PoolFeatureKey.hashrate,
            PoolFeatureKey.rawStats,
        ]);
        expect(values).to.deep.equal({
            'info.username': 'me',
            'stats.hashrate5m': 1e12,
            'raw.stats': '{"a":1}',
        });
    });

    it('has a state object for every worker value', () => {
        const values = getWorkerStateValues({ name: 'me.rig', state: 'low', lastShare: 1, hashrate5m: 2 });
        expect(values).to.deep.equal({ name: 'me.rig', state: 'low', lastShare: 1, hashrate5m: 2 });
        expect(Object.keys(getWorkerStateObjects())).to.include.members(Object.keys(values));
    });

    describe('getWorkerObjectId', () => {
        it('strips the account name', () => {
            expect(getWorkerObjectId('username.worker1', 'username')).to.equal('worker1');
        });

        it('replaces characters not allowed in object ids', () => {
            expect(getWorkerObjectId('other.s19 #1*', 'username')).to.equal('other_s19__1_');
            expect(getWorkerObjectId('', undefined)).to.equal('_');
        });
    });
});
