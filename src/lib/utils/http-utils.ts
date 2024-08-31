import {Logger} from '../miner/model/Logger';

// TODO: ignore cert support
export async function sendGenericHTTPRequest<T>(
    protocol: 'http' | 'https',
    host: string,
    port: number,
    password: string, // password / api-token
    logger: Logger,
    endpoint: string,
    httpMethod: string,
    body?: object
): Promise<T> {
    try {
        const response = await fetch(`${protocol}://${host}:${port}/${endpoint}`, {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${password}`
            },
            body: (body ? JSON.stringify(body) : null)
        })

        if (response.status !== 200) {
            const error = `Error sending JSON-RPC command: ${response.statusText}`;
            logger.error(error);
            return Promise.reject(error);
        }

        return await response.json() as T;
    } catch (e) {
        logger.error(`Error sending HTTP request: ${e}`);
        return Promise.reject(e);
    }
}