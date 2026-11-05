import { expect } from 'chai';
import { RequestThrottle } from './request-throttle';

describe('RequestThrottle', () => {
    it('runs requests with the same key one after another, spaced', async () => {
        const throttle = new RequestThrottle(30);
        const events: string[] = [];
        const starts: number[] = [];
        const request = (name: string) => async (): Promise<string> => {
            starts.push(Date.now());
            events.push(`start ${name}`);
            await new Promise(resolve => setTimeout(resolve, 5));
            events.push(`end ${name}`);
            return name;
        };

        const results = await Promise.all([throttle.run('a', request('1')), throttle.run('a', request('2'))]);

        expect(results).to.deep.equal(['1', '2']);
        expect(events).to.deep.equal(['start 1', 'end 1', 'start 2', 'end 2']);
        // 30ms spacing after the first request ended (which took >= 5ms); allow some timer slack
        expect(starts[1] - starts[0]).to.be.at.least(30);
    });

    it('does not space requests with different keys', async () => {
        const throttle = new RequestThrottle(10_000);
        const start = Date.now();
        await Promise.all([throttle.run('a', () => Promise.resolve()), throttle.run('b', () => Promise.resolve())]);
        expect(Date.now() - start).to.be.below(1000);
    });

    it('keeps going after a failed request', async () => {
        const throttle = new RequestThrottle(0);
        const failed = throttle.run('a', () => Promise.reject(new Error('boom')));
        const next = throttle.run('a', () => Promise.resolve('ok'));
        expect(((await failed.catch((e: unknown) => e)) as Error).message).to.contain('boom');
        expect(await next).to.equal('ok');
    });
});
