/**
 * Connection indicator (#231): `info.connection` lists the reachable miners, so the instance shows green in the admin
 * while at least one answers.
 */

const net = require('net');
const { expect } = require('chai');

const summaryVersionFixture = require('../../src/lib/miner/fixture/nano3s-summary+version.json');

/**
 * A miner speaking the CGMiner API: answers every request with the summary+version fixture.
 * `stop()` makes it unreachable, like a miner that was switched off.
 */
async function startFakeMiner() {
    const sockets = new Set();
    const server = net.createServer(socket => {
        sockets.add(socket);
        socket.on('close', () => sockets.delete(socket));
        socket.on('data', () => socket.end(JSON.stringify(summaryVersionFixture)));
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(undefined)));
    return {
        port: /** @type {net.AddressInfo} */ (server.address()).port,
        stop: () =>
            new Promise(resolve => {
                sockets.forEach(socket => socket.destroy());
                server.close(() => resolve(undefined));
            }),
    };
}

/**
 * Waits until a state has the expected value.
 *
 * @param harness - the test harness
 * @param id - full state id
 * @param expected - the value to wait for
 * @param timeoutMs - how long to wait at most
 */
async function waitForState(harness, id, expected, timeoutMs) {
    const until = Date.now() + timeoutMs;
    let state;
    while (Date.now() < until) {
        state = await harness.states.getStateAsync(id);
        if (state && state.val === expected) {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    throw new Error(`${id} did not become ${expected} within ${timeoutMs}ms (last value: ${state && state.val})`);
}

exports.runTests = function (suite) {
    suite('connection indicator (#231)', getHarness => {
        let harness;
        let miner;

        before(async () => {
            harness = getHarness();
            miner = await startFakeMiner();
            // a device as the device manager stores it
            await harness.objects.setObjectAsync('miner.0.miner.it-cgminer', {
                type: 'device',
                common: { name: 'integration test miner' },
                native: {
                    category: 'miner',
                    name: 'integration test miner',
                    mac: '',
                    settings: {
                        id: 'it-cgminer',
                        minerType: 'cgMiner',
                        host: '127.0.0.1',
                        port: miner.port,
                        pollInterval: 500,
                    },
                },
            });
        });

        after(async () => {
            await miner.stop();
        });

        it('lists a miner in info.connection once it answers', async () => {
            await harness.startAdapterAndWait();

            await waitForState(harness, 'miner.0.miner.it-cgminer.info.online', true, 10_000);
            // a non-empty list is what turns the instance green in the admin
            await waitForState(harness, 'miner.0.info.connection', 'integration test miner', 5_000);
        }).timeout(30_000);

        it('empties the list again when no miner is reachable anymore', async () => {
            await miner.stop();

            // offline after 3 failed polls: with the backoff that is a few seconds at a 500 ms poll interval
            await waitForState(harness, 'miner.0.miner.it-cgminer.info.online', false, 20_000);
            const connection = await harness.states.getStateAsync('miner.0.info.connection');
            expect(connection && connection.val).to.equal('');
        }).timeout(30_000);
    });
};
