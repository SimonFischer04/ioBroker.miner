import { expect } from 'chai';
import { createServer, type Server } from 'node:net';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sendSocketCommand } from './socket-utils';
import { Logger } from '../miner/model/Logger';
import type { SummaryVersionStatsResponse } from '../miner/miner/AvalonMiner';
import { AvalonMiner } from '../miner/miner/AvalonMiner';

const logger = Logger.getLogger('socket-utils.test');

/**
 * Create a mock TCP server that responds with the given data.
 * Optionally splits the response into chunks to simulate real-world TCP behaviour.
 */
function createMockServer(responseData: string, chunkSize?: number): Promise<{ server: Server; port: number }> {
    return new Promise((resolve, reject) => {
        const server = createServer(socket => {
            socket.on('data', () => {
                if (chunkSize && chunkSize < responseData.length) {
                    // Send data in chunks to simulate fragmented TCP delivery
                    let offset = 0;
                    const sendNextChunk = (): void => {
                        if (offset >= responseData.length) {
                            socket.end();
                            return;
                        }
                        const chunk = responseData.slice(offset, offset + chunkSize);
                        offset += chunkSize;
                        socket.write(chunk, () => {
                            // Small delay between chunks to simulate network latency
                            setTimeout(sendNextChunk, 1);
                        });
                    };
                    sendNextChunk();
                } else {
                    socket.end(responseData);
                }
            });
        });

        server.listen(0, '127.0.0.1', () => {
            const addr = server.address();
            if (addr && typeof addr === 'object') {
                resolve({ server, port: addr.port });
            } else {
                reject(new Error('Failed to get server address'));
            }
        });
    });
}

describe('socket-utils', () => {
    const fixtureDir = join(__dirname, '..', 'miner', 'fixture');
    const summaryVersionStatsJson = readFileSync(join(fixtureDir, 'nano3s-summary+version+stats.json'), 'utf-8');

    describe('sendSocketCommand', () => {
        it('should handle response sent in a single chunk', async () => {
            const { server, port } = await createMockServer(summaryVersionStatsJson);
            try {
                const result = await sendSocketCommand<SummaryVersionStatsResponse>(
                    logger,
                    '127.0.0.1',
                    port,
                    { command: 'summary+version+stats', parameter: '' },
                    true,
                );

                expect(result).to.have.property('summary');
                expect(result).to.have.property('version');
                expect(result).to.have.property('stats');
                expect(result.summary[0].SUMMARY[0].Elapsed).to.be.a('number');
            } finally {
                server.close();
            }
        });

        it('should handle response split into small chunks (fragmented TCP)', async () => {
            // Use a small chunk size to simulate TCP fragmentation — the fixture is ~3KB
            const { server, port } = await createMockServer(summaryVersionStatsJson, 256);
            try {
                const result = await sendSocketCommand<SummaryVersionStatsResponse>(
                    logger,
                    '127.0.0.1',
                    port,
                    { command: 'summary+version+stats', parameter: '' },
                    true,
                );

                expect(result).to.have.property('summary');
                expect(result).to.have.property('version');
                expect(result).to.have.property('stats');
                expect(result.summary[0].SUMMARY[0].Elapsed).to.be.a('number');
                expect(result.version[0].VERSION[0].CGMiner).to.equal('4.11.1');

                // Verify the full response can be parsed by AvalonMiner
                const miner = new AvalonMiner({
                    minerType: 'avalonMiner',
                    host: '127.0.0.1',
                    port,
                    pollInterval: 10000,
                });
                const stats = miner.parseSummaryVersionStatsResponse(result);
                expect(stats.version).to.equal('4.11.1');
                expect(stats.totalHashrate).to.be.a('number');
                expect(stats.power).to.be.a('number');
            } finally {
                server.close();
            }
        });
    });
});

