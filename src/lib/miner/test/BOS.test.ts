import { expect } from 'chai';
import { createServer, type AddressInfo, type Server, type Socket } from 'node:net';
import { BOS } from '../miner/BOS';
import { BosApiClient } from '../api/BosApiClient';
import type { BOSSettings } from '../model/MinerSettings';

/**
 * The deadline the miner's gRPC client puts on its calls.
 *
 * @param settings - settings beyond the required ones
 */
function clientTimeoutMs(settings: Partial<BOSSettings>): number | undefined {
    const bos = new BOS({
        minerType: 'bos',
        host: '127.0.0.1',
        port: 50051,
        username: 'root',
        password: 'root',
        pollInterval: 10000,
        ...settings,
    });
    const client = (bos as unknown as { getClient(): BosApiClient }).getClient();
    const timeoutMs = Reflect.get(client, 'timeoutMs') as number | undefined;
    client.close();
    return timeoutMs;
}

describe('BOS', () => {
    describe('gRPC deadline', () => {
        it('uses the poll timeout when timeoutMs is not set, so a call to a hung miner cannot stay pending forever', () => {
            expect(clientTimeoutMs({ pollInterval: 10_000 })).to.equal(30_000);
            expect(clientTimeoutMs({ pollInterval: 60_000 })).to.equal(60_000);
        });

        it('keeps an explicitly configured timeoutMs', () => {
            expect(clientTimeoutMs({ timeoutMs: 5000 })).to.equal(5000);
        });

        it('ends a call to a miner that accepts the connection but never answers', async () => {
            const sockets: Socket[] = [];
            // accepts TCP connections, then stays silent - like a hung miner
            const server: Server = createServer(socket => sockets.push(socket));
            await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
            const client = new BosApiClient({
                host: '127.0.0.1',
                port: (server.address() as AddressInfo).port,
                timeoutMs: 300,
                username: 'root',
                password: 'root',
            });

            try {
                const startedAt = Date.now();
                const error = await client.login().catch((e: unknown) => e);

                expect(error).to.be.instanceOf(Error);
                expect(Date.now() - startedAt).to.be.lessThan(3000);
            } finally {
                client.close();
                sockets.forEach(s => s.destroy());
                await new Promise(resolve => server.close(resolve));
            }
        });
    });
});
