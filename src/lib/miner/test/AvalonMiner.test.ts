import { expect } from 'chai';
import { createServer, type AddressInfo, type Server } from 'node:net';
import {
    AvalonMiner,
    buildLedSetParameter,
    parseAvalonLedUser,
    parseHexColor,
    toHexColor,
    type SummaryVersionStatsResponse,
} from '../miner/AvalonMiner';
import statsFixture from '../fixture/nano3s-stats.json';
import ascsetFixture from '../fixture/nano3s-ascset-workmode.json';
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
            expect(stats.power).to.equal(131);
            expect(stats.version).to.equal('4.11.1');
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

    describe('profile', () => {
        /**
         * Profile parsed from the fixture with its WORKMODE field replaced.
         *
         * @param workmode - the WORKMODE field, or undefined to remove it
         */
        function profileFor(workmode: string | undefined): string | undefined {
            const json = JSON.stringify(summaryVersionStatsFixture).replace(
                'WORKMODE[2] ',
                workmode === undefined ? '' : `WORKMODE[${workmode}] `,
            );
            return miner.parseSummaryVersionStatsResponse(JSON.parse(json) as SummaryVersionStatsResponse).profile;
        }

        it('reads the active profile from the work mode', () => {
            expect(profileFor('2')).to.equal('high');
            expect(profileFor('1')).to.equal('medium');
            expect(profileFor('0')).to.equal('low');
        });

        it('reports no profile for an unknown or missing work mode', () => {
            expect(profileFor('7')).to.equal(undefined);
            expect(profileFor('constructor')).to.equal(undefined);
            expect(profileFor(undefined)).to.equal(undefined);
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

describe('Avalon light and display', () => {
    describe('parsing', () => {
        it('reports the LED and display settings as custom features', () => {
            const stats = new AvalonMiner({
                minerType: 'avalonMiner',
                host: '10.10.30.51',
                port: 4028,
                pollInterval: 10000,
            }).parseSummaryVersionStatsResponse(withLiteStats([liteStatsFixture as LiteStatsResponse]));

            // LEDUser[0-100-50-0-0-255] LcdOnoff[1]: light off (so no effect reported), blue, display on
            expect(stats.custom).to.deep.equal({
                'light.on': false,
                'light.brightness': 100,
                'light.colorTemperature': 50,
                'light.color': '#0000ff',
                'lcd.on': true,
            });
        });

        it('reports the effect while the light is on', () => {
            const stats = new AvalonMiner({
                minerType: 'avalonMiner',
                host: '10.10.30.51',
                port: 4028,
                pollInterval: 10000,
            }).parseSummaryVersionStatsResponse(
                JSON.parse(
                    JSON.stringify(summaryVersionStatsFixture).replace(
                        'LEDUser[0-100-50-0-0-255]',
                        'LEDUser[3-40-10-255-128-0]',
                    ),
                ) as SummaryVersionStatsResponse,
            );
            expect(stats.custom).to.include({ 'light.on': true, 'light.effect': 3, 'light.color': '#ff8000' });
        });

        it('reports no custom features when the firmware does not report them', () => {
            const stats = new AvalonMiner({
                minerType: 'avalonMiner',
                host: '10.10.30.51',
                port: 4028,
                pollInterval: 10000,
            }).parseSummaryVersionStatsResponse(
                JSON.parse(
                    JSON.stringify(summaryVersionStatsFixture)
                        .replace('LEDUser[0-100-50-0-0-255] ', '')
                        .replace('LcdOnoff[1] ', ''),
                ) as SummaryVersionStatsResponse,
            );
            expect(stats.custom).to.equal(undefined);
        });

        it('parses LEDUser and rejects other formats', () => {
            expect(parseAvalonLedUser('1-100-50-10-20-30')).to.deep.equal({
                effect: 1,
                brightness: 100,
                colorTemperature: 50,
                red: 10,
                green: 20,
                blue: 30,
            });
            expect(parseAvalonLedUser('0-0')).to.equal(undefined);
            expect(parseAvalonLedUser('a-100-50-0-0-255')).to.equal(undefined);
            expect(parseAvalonLedUser(undefined)).to.equal(undefined);
        });

        it('converts colors from and to #rrggbb', () => {
            expect(parseHexColor('#FF8000')).to.deep.equal({ red: 255, green: 128, blue: 0 });
            expect(parseHexColor('0a0b0c')).to.deep.equal({ red: 10, green: 11, blue: 12 });
            expect(() => parseHexColor('red')).to.throw('expected #RRGGBB');
            expect(toHexColor({ red: 10, green: 11, blue: 12 })).to.equal('#0a0b0c');
        });

        it('builds the ledset parameter from all LED settings', () => {
            expect(
                buildLedSetParameter({
                    effect: 1,
                    brightness: 80,
                    colorTemperature: 50,
                    red: 255,
                    green: 0,
                    blue: 0,
                }),
            ).to.equal('0,ledset,1-80-50-255-0-0');
        });
    });

    describe('setting', () => {
        let server: Server;
        let requests: { command: string; parameter: string }[];
        let ascsetReply: object;
        let miner: AvalonMiner;

        /** The ascset parameters the miner received. */
        const ascsets = (): string[] => requests.filter(r => r.command === 'ascset').map(r => r.parameter);

        beforeEach(async () => {
            requests = [];
            ascsetReply = ascsetFixture;
            server = createServer(socket => {
                socket.on('data', data => {
                    const request = JSON.parse(data.toString()) as { command: string; parameter: string };
                    requests.push(request);
                    const reply =
                        request.command === 'ascset'
                            ? ascsetReply
                            : request.command === 'stats'
                              ? statsFixture
                              : {
                                    ...(summaryVersionStatsFixture as SummaryVersionStatsResponse),
                                    litestats: [liteStatsFixture],
                                };
                    socket.end(JSON.stringify(reply));
                });
            });
            await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
            miner = new AvalonMiner({
                minerType: 'avalonMiner',
                host: '127.0.0.1',
                port: (server.address() as AddressInfo).port,
                pollInterval: 10000,
            });
        });

        afterEach(async () => {
            await new Promise(resolve => server.close(resolve));
        });

        it('changes one LED setting and keeps the others the miner reported', async () => {
            await miner.fetchStats();
            expect(await miner.setCustomFeature('light.brightness', '40')).to.equal(40);
            await miner.setCustomFeature('light.color', '#ff0000');
            // each change builds on the previous one, not on the (now outdated) poll
            expect(ascsets()).to.deep.equal(['0,ledset,0-40-50-0-0-255', '0,ledset,0-40-50-255-0-0']);
        });

        it('asks the miner for its LED settings when changing one before the first poll', async () => {
            await miner.setCustomFeature('light.colorTemperature', 20);
            expect(requests.map(r => r.command)).to.deep.equal(['stats', 'ascset']);
            expect(ascsets()).to.deep.equal(['0,ledset,0-100-20-0-0-255']);
        });

        it('turns the light on with the last effect it had', async () => {
            await miner.fetchStats();
            await miner.setCustomFeature('light.on', true);
            await miner.setCustomFeature('light.effect', 3);
            await miner.setCustomFeature('light.on', false);
            await miner.setCustomFeature('light.on', true);
            expect(ascsets()).to.deep.equal([
                // nothing known yet: static
                '0,ledset,1-100-50-0-0-255',
                '0,ledset,3-100-50-0-0-255',
                '0,ledset,0-100-50-0-0-255',
                '0,ledset,3-100-50-0-0-255',
            ]);
        });

        it('sets the work mode of a profile', async () => {
            await miner.setProfile('low');
            expect(ascsets()).to.deep.equal(['0,workmode,set,0']);
        });

        it('fails when the miner rejects the work mode', async () => {
            ascsetReply = { STATUS: [{ STATUS: 'E', Msg: 'Invalid ascset' }] };
            let error: unknown;
            try {
                await miner.setProfile('high');
            } catch (e) {
                error = e;
            }
            expect(String(error)).to.contain('Invalid ascset');
        });

        it('turns the display on and off', async () => {
            await miner.setCustomFeature('lcd.on', false);
            await miner.setCustomFeature('lcd.on', true);
            expect(ascsets()).to.deep.equal(['0,lcd,0:0', '0,lcd,0:1']);
        });

        it('fails when the miner rejects the command', async () => {
            ascsetReply = { STATUS: [{ STATUS: 'E', Msg: 'Invalid ascset' }] };
            let error: unknown;
            try {
                await miner.setCustomFeature('lcd.on', true);
            } catch (e) {
                error = e;
            }
            expect(String(error)).to.contain('Invalid ascset');
        });

        it('sends nothing for invalid values or unknown features', async () => {
            for (const [id, value] of [
                ['light.brightness', 101],
                ['light.effect', 0],
                ['light.color', 'red'],
                ['light.unknown', 1],
            ] as const) {
                let error: unknown;
                try {
                    await miner.setCustomFeature(id, value);
                } catch (e) {
                    error = e;
                }
                expect(error, `${id}=${value}`).to.be.instanceOf(Error);
            }
            expect(ascsets()).to.deep.equal([]);
        });
    });
});
