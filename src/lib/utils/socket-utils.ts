import {Socket} from 'node:net';
import {Logger} from '../miner/model/Logger';

/**
 * Utility function to send a command to a socket server (and wait for a response - if expected)
 * (connection is closed after the response is received or after a timeout)
 *
 * @param logger - logger to use
 * @param host - host to connect to
 * @param port - port to connect to
 * @param data - data to send
 * @param expectResponse - whether to expect a response
 */
export async function sendSocketCommand<T = void>(
    logger: Logger,
    host: string,
    port: number,
    data: object,
    expectResponse: boolean = true
): Promise<T> {
    logger.debug(`sendCommand: ${JSON.stringify(data)}`);

    let handled = false;
    const socket: Socket = new Socket();

    return new Promise<T>((resolve, reject) => {
        socket.on('connect', () => {
            const cmd = JSON.stringify(data) + '\n';
            logger.debug(`connected, sending cmd now ...: ${cmd}`);
            socket.write(cmd, (err) => {
                if (err) {
                    logger.error(err.message);
                    reject(err.message);
                } else {
                    if (!expectResponse) {
                        resolve(undefined as T);
                    }
                }
            });
        });

        socket.on('timeout', () => {

            logger.warn('socket timeout');
            reject('socket timeout');
        });

        socket.on('data', (data) => {
            logger.debug(`received: ${data.toString()}`);
            try {
                // BOS would create error while parsing JSON: uncaught exception: Unexpected non-whitespace character after JSON at position 932
                // Convert buffer to string, remove all non-ASCII characters, trim whitespace, and remove unexpected characters after JSON data
                const jsonString = data.toString()
                    .replace(/[^\x00-\x7F]/g, '')
                    .trim()
                    .replace(/[^}\]]*$/, '');

                const d = JSON.parse(jsonString);
                resolve(d as T);
            } catch (e) {
                const errMsg = `Failed to parse JSON: ${e}`;
                logger.error(errMsg);
                reject(errMsg);
            }
        });

        socket.on('close', () => {
        }); // discard

        socket.on('error', (err) => {
            logger.error(err.message);
            reject(`socket error: ${err.message}`);
        });

        socket.setTimeout(3000);
        socket.connect(port, host);

        // socket timeout alone does is not enough
        setTimeout(() => {
            if (!handled) {
                const msg = `timeout handling socket command: ${JSON.stringify(data)}. maybe the password is wrong?`;
                logger.warn(msg);
                reject(msg);
            }
        }, 3000)
    }).finally(() => {
        handled = true;
        socket.end();
        socket.destroy();
    });
}