import { expect } from 'chai';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import { sendGenericHTTPRequest } from './http-utils';
import { Logger } from '../miner/model/Logger';

const logger = Logger.getLogger('http-utils.test');

/**
 * Start a local HTTP server with the given request handler.
 *
 * @param handler - request handler
 */
function startServer(
    handler: (req: IncomingMessage, res: ServerResponse) => void,
): Promise<{ server: Server; port: number }> {
    return new Promise(resolve => {
        const server = createServer(handler);
        server.listen(0, '127.0.0.1', () => resolve({ server, port: (server.address() as AddressInfo).port }));
    });
}

describe('sendGenericHTTPRequest', () => {
    let server: Server | undefined;

    afterEach(async () => {
        server?.closeAllConnections();
        await new Promise(resolve => server?.close(resolve) ?? resolve(undefined));
        server = undefined;
    });

    it('returns the parsed JSON body', async () => {
        const started = await startServer((_req, res) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
        });
        server = started.server;

        const result = await sendGenericHTTPRequest<{ ok: boolean }>(
            'http',
            '127.0.0.1',
            started.port,
            '',
            logger,
            'api',
            'GET',
            undefined,
            1000,
        );

        expect(result).to.deep.equal({ ok: true });
    });

    it('aborts a request the server never answers once timeoutMs has passed, and closes its connection', async () => {
        let connectionClosed = false;
        // accepts the request, then never answers
        const started = await startServer(req => {
            req.socket.on('close', () => {
                connectionClosed = true;
            });
        });
        server = started.server;

        const startedAt = Date.now();
        const error = await sendGenericHTTPRequest(
            'http',
            '127.0.0.1',
            started.port,
            '',
            logger,
            'api',
            'GET',
            undefined,
            200,
        ).catch((e: unknown) => e);

        expect(error).to.be.instanceOf(Error);
        expect(Date.now() - startedAt).to.be.lessThan(2000);
        // the abort has to reach the connection, not just stop the wait
        await new Promise(resolve => setTimeout(resolve, 100));
        expect(connectionClosed).to.equal(true);
    });
});
