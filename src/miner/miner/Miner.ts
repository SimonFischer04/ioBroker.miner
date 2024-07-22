// TODO:  ?
import {MinerSettings} from '../model/MinerSettings';

export abstract class Miner<S extends MinerSettings> {
    constructor(
        protected readonly settings: S
    ) {
    }

    public abstract connect(): Promise<void>;

    public abstract start(): Promise<void>;

    /**
     * Stop mining
     */
    public abstract stop(): Promise<void>;

    /**
     * Close / cleanup any open resources
     */
    public abstract close(): Promise<void>;
}