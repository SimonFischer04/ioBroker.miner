import {Miner} from './Miner';
import {MinerSettings} from '../model/MinerSettings';

export abstract class PollingMiner<S extends MinerSettings> extends Miner<S> {
    /*
TODO: pollInterval: NodeJs.Timeout
auto close in close method
*/

    public abstract fetchData(): Promise<void>;
}