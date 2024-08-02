import {Miner} from './Miner';
import {PollingMinerSettings} from '../model/MinerSettings';
import {Logger} from '../model/Logger';
import {asyncInterval, AsyncIntervalReturnType} from '../../utils/delay';

// TODO: improve name
const logger: Logger = Logger.getLogger('PollingMiner');

export abstract class PollingMiner<S extends PollingMinerSettings> extends Miner<S> {
    private pollInterval: AsyncIntervalReturnType | undefined;

    public abstract fetchData(): Promise<void>;

    public override async init(): Promise<void> {
        logger.info(`initializing with interval ${this.settings.pollInterval}`);

        if (!this.settings.pollInterval || this.settings.pollInterval < 100) {
            logger.error(`pollInterval >= 100 required. got: ${this.settings.pollInterval}`);
            return;
        }

        // start polling
        this.pollInterval = asyncInterval(async () => {
            logger.debug('next poll interval time reached. calling fetchData()');
            await this.fetchData();
        }, this.settings.pollInterval, true);
    }

    public override async close(): Promise<void> {
        this.pollInterval?.clear();
    }
}