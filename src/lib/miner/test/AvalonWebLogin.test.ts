import { expect } from 'chai';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createTcpServer, type AddressInfo } from 'node:net';
import { AvalonMiner } from '../miner/AvalonMiner';
import {
    buildQrAuthParameter,
    computeQrAuthVerify,
    isWrongPasswordError,
    parseAuthChallenge,
} from '../api/AvalonWebLogin';

// Reference values computed independently from the firmware algorithm (get_random_dna / set_avalon_qr_auth in
// Canaan-Creative/avalon_nano3s): for a device DNA and web password, the challenge the miner hands out and the proof
// it accepts.
const VECTORS = [
    {
        dna: '020100003e2b4c50',
        password: 'admin',
        auth: '7c8a63a1',
        code: '5a2aed8934430f85ab8dcedf',
        verify: 'ff0000ee52ac6bd27b7bb9aa535dc533',
    },
    {
        dna: '0123456789abcdef',
        password: 's3cret-Pässwort',
        auth: '0339c6c0',
        code: '9f9f5111f7b27a781f1f1ddd',
        verify: 'ff0000eeb2cdfefdd5d05197e850d801',
    },
];

describe('AvalonWebLogin', () => {
    describe('parseAuthChallenge', () => {
        it('parses the JavaScript callback get_auth.cgi returns, trailing comma and whitespace included', () => {
            // formatted like the firmware's sprintf output
            const body =
                'getAuthCallback ({\t"auth":"7c8a63a1",                        "code":"5a2aed8934430f85ab8dcedf",                            });                            ';

            expect(parseAuthChallenge(body)).to.deep.equal({ auth: '7c8a63a1', code: '5a2aed8934430f85ab8dcedf' });
        });

        it('rejects a reply without auth or code', () => {
            expect(() => parseAuthChallenge('<html>login</html>')).to.throw('unexpected get_auth.cgi response');
            expect(() => parseAuthChallenge('getAuthCallback ({"auth":"7c8a63a1"});')).to.throw();
        });
    });

    describe('computeQrAuthVerify', () => {
        for (const v of VECTORS) {
            it(`matches the firmware for password "${v.password}"`, () => {
                expect(computeQrAuthVerify(v.code, v.password)).to.equal(v.verify);
            });
        }

        it('depends on the password', () => {
            const [v] = VECTORS;
            expect(computeQrAuthVerify(v.code, 'wrong')).to.not.equal(v.verify);
        });
    });

    describe('buildQrAuthParameter', () => {
        it('builds the ascset parameter: device 0, option qr_auth, the random value and the proof', () => {
            const [v] = VECTORS;

            expect(buildQrAuthParameter({ auth: v.auth, code: v.code }, v.password)).to.equal(
                `0,qr_auth,${v.auth},${v.verify}`,
            );
        });
    });

    describe('isWrongPasswordError', () => {
        it('recognizes the firmware message for a wrong password only', () => {
            expect(isWrongPasswordError('ASC 0 set failed: passwd error 02!')).to.equal(true);
            expect(isWrongPasswordError('ASC 0 set failed: auth error 01!')).to.equal(false);
        });
    });
});

/**
 * A fake Avalon miner: its web interface hands out the challenge of the first reference vector, and its cgminer API
 * accepts `qr_auth` only with that vector's proof - answering like the firmware does.
 */
async function startFakeAvalon(): Promise<{
    webPort: number;
    apiPort: number;
    received: string[];
    close: () => Promise<void>;
}> {
    const [v] = VECTORS;
    const received: string[] = [];

    const web = createHttpServer((req, res) => {
        if (req.url?.startsWith('/get_auth.cgi')) {
            res.end(`getAuthCallback ({\t"auth":"${v.auth}",    "code":"${v.code}",    });    `);
        } else {
            res.end('<html>login</html>');
        }
    });
    const api = createTcpServer(socket => {
        socket.on('data', data => {
            const request = JSON.parse(data.toString()) as { command: string; parameter: string };
            received.push(`${request.command}|${request.parameter}`);
            const [, option, random, verify] = request.parameter.split(',');
            let status = { STATUS: 'S', Msg: 'ASC 0 set OK' };
            if (option === 'qr_auth' && random !== v.auth) {
                status = { STATUS: 'E', Msg: 'ASC 0 set failed: auth error 01!' };
            } else if (option === 'qr_auth' && verify !== v.verify) {
                status = { STATUS: 'E', Msg: 'ASC 0 set failed: passwd error 02!' };
            }
            socket.end(JSON.stringify({ STATUS: [{ ...status, When: 0, Code: 119, Description: 'cgminer' }], id: 1 }));
        });
    });
    await new Promise<void>(resolve => web.listen(0, '127.0.0.1', resolve));
    await new Promise<void>(resolve => api.listen(0, '127.0.0.1', resolve));

    return {
        webPort: (web.address() as AddressInfo).port,
        apiPort: (api.address() as AddressInfo).port,
        received,
        close: async () => {
            web.closeAllConnections();
            await new Promise(resolve => web.close(resolve));
            await new Promise(resolve => api.close(resolve));
        },
    };
}

describe('AvalonMiner.approveWebLogin', () => {
    let fake: Awaited<ReturnType<typeof startFakeAvalon>>;

    beforeEach(async () => {
        fake = await startFakeAvalon();
    });

    afterEach(async () => {
        await fake.close();
    });

    function miner(webPassword: string | undefined): AvalonMiner {
        return new AvalonMiner({
            minerType: 'avalonMiner',
            host: '127.0.0.1',
            port: fake.apiPort,
            webPort: fake.webPort,
            pollInterval: 10000,
            webPassword,
        });
    }

    it('approves the login with the right password', async () => {
        const [v] = VECTORS;

        await miner(v.password).approveWebLogin();

        expect(fake.received).to.deep.equal([`ascset|0,qr_auth,${v.auth},${v.verify}`]);
    });

    it('fails with the firmware message when the password is wrong', async () => {
        const error = (await miner('wrong')
            .approveWebLogin()
            .catch((e: unknown) => e)) as Error;

        expect(error).to.be.instanceOf(Error);
        expect(isWrongPasswordError(error.message)).to.equal(true);
    });

    it('does not contact the miner without a web password', async () => {
        const error = (await miner(undefined)
            .approveWebLogin()
            .catch((e: unknown) => e)) as Error;

        expect(error.message).to.equal('no web password configured');
        expect(fake.received).to.deep.equal([]);
    });

    it('fails without sending anything when the web interface does not hand out a challenge', async () => {
        // e.g. a different firmware: only the login page, no get_auth.cgi
        const web = createHttpServer((_req, res) => res.end('<html>login</html>'));
        await new Promise<void>(resolve => web.listen(0, '127.0.0.1', resolve));

        try {
            const m = new AvalonMiner({
                minerType: 'avalonMiner',
                host: '127.0.0.1',
                port: fake.apiPort,
                webPort: (web.address() as AddressInfo).port,
                pollInterval: 10000,
                webPassword: 'admin',
            });

            const error = (await m.approveWebLogin().catch((e: unknown) => e)) as Error;

            expect(error.message).to.contain('unexpected get_auth.cgi response');
            expect(fake.received).to.deep.equal([]);
        } finally {
            web.closeAllConnections();
            await new Promise(resolve => web.close(resolve));
        }
    });
});
