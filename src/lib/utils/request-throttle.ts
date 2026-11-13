import { delay } from './delay';

/**
 * Runs requests to the same API one after another, with at least `minSpacingMs` between the end of one request and
 * the start of the next. Meant for APIs with a rate limit per client (IP), which every device using the API shares.
 */
export class RequestThrottle {
    private readonly queues = new Map<string, Promise<unknown>>();
    private readonly lastFinished = new Map<string, number>();

    /**
     * @param minSpacingMs - minimum time between two requests with the same key
     */
    constructor(public minSpacingMs: number) {}

    /**
     * Run `request` once all earlier requests with the same key are done and the spacing has passed.
     * A failed request doesn't affect the ones queued after it.
     *
     * @param key - requests with the same key are spaced, e.g. the API's base URL
     * @param request - the request to run
     * @param isCancelled - checked when it is the request's turn: if it returns true, the request is rejected
     * without being run and without taking a slot, so the next one doesn't have to wait for the spacing
     */
    public run<T>(key: string, request: () => Promise<T>, isCancelled?: () => boolean): Promise<T> {
        const previous = this.queues.get(key) ?? Promise.resolve();
        const next = previous
            .catch(() => undefined)
            .then(async () => {
                const cancelIfRequested = (): void => {
                    if (isCancelled?.()) {
                        throw new Error('request was cancelled');
                    }
                };
                cancelIfRequested();
                const waitMs = (this.lastFinished.get(key) ?? -Infinity) + this.minSpacingMs - Date.now();
                if (waitMs > 0) {
                    await delay(waitMs);
                    cancelIfRequested();
                }
                try {
                    return await request();
                } finally {
                    this.lastFinished.set(key, Date.now());
                }
            });
        this.queues.set(key, next);
        // drop the queue entry once it's the last one, so finished keys don't keep their promise chain
        void next
            .catch(() => undefined)
            .then(() => {
                if (this.queues.get(key) === next) {
                    this.queues.delete(key);
                }
            });
        return next;
    }
}
