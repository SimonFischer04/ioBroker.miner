import { expect } from 'chai';
import {ClaymoreMiner, MinerGetStat1Response, MinerGetStat2Response} from '../miner/ClaymoreMiner'; // Adjust the import path as needed

describe('Miner Stat Parsing Functions', () => {
    let miner: ClaymoreMiner;

    beforeEach(() => {
        miner = new ClaymoreMiner({
            minerType: 'claymore',
            host: 'localhost',
            port: 3333,
            pollInterval: 1000,
            password: ''
        });
    });

    describe('parseMinerGetStat1', () => {
        it('should correctly parse a valid miner_getstat1 response', () => {
            const input: MinerGetStat1Response = {
                id: 0,
                jsonrpc: '2.0',
                result: [
                    '9.3 - ETH',
                    '21',
                    '182724;51;0',
                    '30502;30457;30297;30481;30479;30505',
                    '0;0;0',
                    'off;off;off;off;off;off',
                    '53;71;57;67;61;72;55;70;59;71;61;70',
                    'eth-eu1.nanopool.org:9999',
                    '0;0;0;0'
                ]
            };

            const result = miner.parseMinerGetStat1(input);

            expect(result.minerVersion).to.equal('9.3 - ETH');
            expect(result.runningTimeMinutes).to.equal(21);
            expect(result.ethTotal).to.deep.equal({ hashrate: 182724, shares: 51, rejectedShares: 0 });
            expect(result.ethDetailedHashrate).to.deep.equal([30502, 30457, 30297, 30481, 30479, 30505]);
            expect(result.dcrTotal).to.deep.equal({ hashrate: 0, shares: 0, rejectedShares: 0 });
            expect(result.dcrDetailedHashrate).to.deep.equal(['off', 'off', 'off', 'off', 'off', 'off']);
            expect(result.gpuInfo).to.deep.equal([
                { temperature: 53, fanSpeed: 71 },
                { temperature: 57, fanSpeed: 67 },
                { temperature: 61, fanSpeed: 72 },
                { temperature: 55, fanSpeed: 70 },
                { temperature: 59, fanSpeed: 71 },
                { temperature: 61, fanSpeed: 70 }
            ]);
            expect(result.currentMiningPool).to.equal('eth-eu1.nanopool.org:9999');
            expect(result.stats).to.deep.equal({
                ethInvalidShares: 0,
                ethPoolSwitches: 0,
                dcrInvalidShares: 0,
                dcrPoolSwitches: 0
            });
        });

        it('should handle empty strings in the result array', () => {
            const input: MinerGetStat1Response = {
                id: 0,
                jsonrpc: '2.0',
                result: [
                    '',
                    '0',
                    '0;0;0',
                    '',
                    '0;0;0',
                    '',
                    '',
                    '',
                    '0;0;0;0'
                ]
            };

            const result = miner.parseMinerGetStat1(input);

            expect(result.minerVersion).to.equal('');
            expect(result.runningTimeMinutes).to.equal(0);
            expect(result.ethDetailedHashrate).to.deep.equal([]);
            expect(result.dcrDetailedHashrate).to.deep.equal([]);
            expect(result.gpuInfo).to.deep.equal([]);
            expect(result.currentMiningPool).to.equal('');
        });
    });

    describe('parseMinerGetStat2', () => {
        it('should correctly parse a valid miner_getstat2 response', () => {
            const input: MinerGetStat2Response = {
                id: 0,
                jsonrpc: '2.0',
                result: [
                    '9.3 - ETH',
                    '21',
                    '182724;51;0',
                    '30502;30457;30297;30481;30479;30505',
                    '0;0;0',
                    'off;off;off;off;off;off',
                    '53;71;57;67;61;72;55;70;59;71;61;70',
                    'eth-eu1.nanopool.org:9999',
                    '0;0;0;0',
                    '10;10;10;10;10;10',
                    '0;0;0;0;0;0',
                    '0;0;0;0;0;0',
                    '0;0;0;0;0;0',
                    '0;0;0;0;0;0',
                    '0;0;0;0;0;0',
                    '0;1;2;3;4;5'
                ]
            };

            const result = miner.parseMinerGetStat2(input);

            expect(result).to.deep.include(miner.parseMinerGetStat1(input as unknown as MinerGetStat1Response));
            expect(result.ethAcceptedShares).to.deep.equal([10, 10, 10, 10, 10, 10]);
            expect(result.ethRejectedShares).to.deep.equal([0, 0, 0, 0, 0, 0]);
            expect(result.ethInvalidShares).to.deep.equal([0, 0, 0, 0, 0, 0]);
            expect(result.dcrAcceptedShares).to.deep.equal([0, 0, 0, 0, 0, 0]);
            expect(result.dcrRejectedShares).to.deep.equal([0, 0, 0, 0, 0, 0]);
            expect(result.dcrInvalidShares).to.deep.equal([0, 0, 0, 0, 0, 0]);
            expect(result.pciBusIndexes).to.deep.equal([0, 1, 2, 3, 4, 5]);
        });

        it('should handle empty strings in the additional fields', () => {
            const input: MinerGetStat2Response = {
                id: 0,
                jsonrpc: '2.0',
                result: [
                    '9.3 - ETH',
                    '21',
                    '182724;51;0',
                    '30502;30457;30297;30481;30479;30505',
                    '0;0;0',
                    'off;off;off;off;off;off',
                    '53;71;57;67;61;72;55;70;59;71;61;70',
                    'eth-eu1.nanopool.org:9999',
                    '0;0;0;0',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    ''
                ]
            };

            const result = miner.parseMinerGetStat2(input);

            expect(result.ethAcceptedShares).to.deep.equal([]);
            expect(result.ethRejectedShares).to.deep.equal([]);
            expect(result.ethInvalidShares).to.deep.equal([]);
            expect(result.dcrAcceptedShares).to.deep.equal([]);
            expect(result.dcrRejectedShares).to.deep.equal([]);
            expect(result.dcrInvalidShares).to.deep.equal([]);
            expect(result.pciBusIndexes).to.deep.equal([]);
        });
    });

    describe('parseMinerGetStat1 edge cases', () => {
        it('should handle invalid number formats', () => {
            const input: MinerGetStat1Response = {
                id: 0,
                jsonrpc: '2.0',
                result: [
                    '9.3 - ETH',
                    'invalid',
                    'invalid;51;0',
                    '30502;invalid;30297;30481;30479;30505',
                    '0;0;0',
                    'off;off;off;off;off;off',
                    '53;71;invalid;67;61;72',
                    'eth-eu1.nanopool.org:9999',
                    '0;invalid;0;0'
                ]
            };

            const result = miner.parseMinerGetStat1(input);

            expect(result.runningTimeMinutes).to.equal(0);
            expect(result.ethTotal.hashrate).to.equal(0);
            expect(result.ethDetailedHashrate).to.deep.equal([30502, 0, 30297, 30481, 30479, 30505]);
            expect(result.gpuInfo).to.deep.equal([
                { temperature: 53, fanSpeed: 71 },
                { temperature: 61, fanSpeed: 72 }
            ]);
            expect(result.stats.ethPoolSwitches).to.equal(0);
        });

        it('should handle all invalid gpu info', () => {
            const input: MinerGetStat1Response = {
                id: 0,
                jsonrpc: '2.0',
                result: [
                    '9.3 - ETH',
                    '21',
                    '182724;51;0',
                    '30502;30457;30297;30481;30479;30505',
                    '0;0;0',
                    'off;off;off;off;off;off',
                    'invalid;invalid;invalid;invalid;invalid;invalid',
                    'eth-eu1.nanopool.org:9999',
                    '0;0;0;0'
                ]
            };

            const result = miner.parseMinerGetStat1(input);

            expect(result.gpuInfo).to.deep.equal([]);
        });
    });

    describe('parseMinerGetStat2 edge cases', () => {
        it('should handle missing additional fields', () => {
            const input: MinerGetStat2Response = {
                id: 0,
                jsonrpc: '2.0',
                result: [
                    '9.3 - ETH',
                    '21',
                    '182724;51;0',
                    '30502;30457;30297;30481;30479;30505',
                    '0;0;0',
                    'off;off;off;off;off;off',
                    '53;71;57;67;61;72;55;70;59;71;61;70',
                    'eth-eu1.nanopool.org:9999',
                    '0;0;0;0'
                ]
            } as unknown as MinerGetStat2Response;

            const result = miner.parseMinerGetStat2(input);

            expect(result.ethAcceptedShares).to.deep.equal([]);
            expect(result.ethRejectedShares).to.deep.equal([]);
            expect(result.ethInvalidShares).to.deep.equal([]);
            expect(result.dcrAcceptedShares).to.deep.equal([]);
            expect(result.dcrRejectedShares).to.deep.equal([]);
            expect(result.dcrInvalidShares).to.deep.equal([]);
            expect(result.pciBusIndexes).to.deep.equal([]);
        });
    });
});