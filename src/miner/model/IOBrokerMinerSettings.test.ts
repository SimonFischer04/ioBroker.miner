import { expect } from 'chai';
import { decryptDeviceSettings, encryptDeviceSettings, isMiner, isPool } from './IOBrokerMinerSettings';
import type { IOBrokerPoolSettings } from './IOBrokerMinerSettings';
import type { BraiinsPoolSettings } from '../../lib/miner/model/PoolSettings';

describe('IOBrokerMinerSettings', () => {
    it('tells miners and pools apart', () => {
        expect(isPool({ category: 'pool' })).to.equal(true);
        expect(isMiner({ category: 'pool' })).to.equal(false);
        expect(isPool({ category: 'miner' })).to.equal(false);
    });

    it('encrypts and decrypts the API token of a Braiins Pool account', () => {
        const settings: IOBrokerPoolSettings = {
            category: 'pool',
            name: 'my pool',
            enabled: true,
            settings: {
                poolType: 'braiinsPool',
                id: '1',
                pollInterval: 60_000,
                apiToken: 'token',
            } as BraiinsPoolSettings,
        };

        const encrypted = encryptDeviceSettings(settings, value => `enc(${value})`) as IOBrokerPoolSettings;
        expect((encrypted.settings as BraiinsPoolSettings).apiToken).to.equal('enc(token)');

        const decrypted = decryptDeviceSettings(encrypted, value => value.slice(4, -1)) as IOBrokerPoolSettings;
        expect((decrypted.settings as BraiinsPoolSettings).apiToken).to.equal('token');
    });
});
