import { expect } from 'chai';
import { MinerManager } from '../miner/MinerManager';
import type { CGMinerSettings } from '../model/MinerSettings';
import { resetTimerBackend, setTimerBackend } from '../../utils/delay';

describe('MinerManager', () => {
    beforeEach(() => {
        // timers never fire: only the registration of the miners matters here, not their polls
        setTimerBackend({
            schedule: () => undefined,
            clear: () => {},
            scheduleInterval: () => undefined,
            clearInterval: () => {},
            delay: () => Promise.resolve(),
        });
    });

    afterEach(() => {
        resetTimerBackend();
    });

    function settings(id: string): CGMinerSettings {
        // nothing listens on the discard port: the miners just fail their first poll
        return { minerType: 'cgMiner', id, host: '127.0.0.1', port: 9, pollInterval: 60_000 };
    }

    it('does not remove another miner when a second close() arrives while the first is still closing', async () => {
        const manager = new MinerManager();
        const first = await manager.init(settings('first'));
        await manager.init(settings('second'));

        // closing waits for stats that are being published: hold it open like that
        let finishClosing: (() => void) | undefined;
        const close = first.close.bind(first);
        first.close = async (): Promise<void> => {
            await new Promise<void>(resolve => {
                finishClosing = resolve;
            });
            await close();
        };

        const closing = [manager.close('first'), manager.close('first')];
        expect(manager.hasMiner('first')).to.equal(false);
        finishClosing?.();
        await Promise.all(closing);

        expect(manager.getMiners().map(miner => miner.settings.id)).to.deep.equal(['second']);
        await manager.closeAll();
        expect(manager.getMiners()).to.deep.equal([]);
    });
});
