import type { Logger } from '../miner/model/Logger';

// TODO: ignore cert support
/**
 *
 * @param protocol - the protocol to use (http or https)
 * @param host - the hostname or IP address
 * @param port - the port number
 * @param password - the password or API token for authentication
 * @param logger - the logger instance
 * @param endpoint - the API endpoint path
 * @param httpMethod - the HTTP method (GET, POST, etc.)
 * @param body - optional request body
 */
export async function sendGenericHTTPRequest<T>(
    protocol: 'http' | 'https',
    host: string,
    port: number,
    password: string, // password / api-token
    logger: Logger,
    endpoint: string,
    httpMethod: string,
    body?: object,
): Promise<T> {
    try {
        const response = await fetch(`${protocol}://${host}:${port}/${endpoint}`, {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${password}`,
            },
            body: body ? JSON.stringify(body) : null,
        });

        if (response.status !== 200) {
            const error = `Error sending JSON-RPC command: ${response.statusText}`;
            logger.error(error);
            return Promise.reject(new Error(error));
        }

        return (await response.json()) as T;
    } catch (e) {
        logger.error(`Error sending HTTP request: ${String(e)}`);
        return Promise.reject(e instanceof Error ? e : new Error(String(e)));
    }
}
