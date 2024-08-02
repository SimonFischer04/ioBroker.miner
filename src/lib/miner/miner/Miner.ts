// TODO:  ?
import {MinerSettings} from '../model/MinerSettings';
import * as crypto from 'node:crypto';

export abstract class Miner<S extends MinerSettings> {
    // TODO: protected base logger

    constructor(
        public readonly settings: S
    ) {
        if(!settings.id) {
            this.settings.id = crypto.randomUUID();
        }
    }

    /**
     * Initialize the miner: connect, start polling (for polling miners, ...), ...
     */
    public abstract init(): Promise<void>;

    /**
     * Start mining
     */
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