// TODO:  ?
import {MinerSettings} from '../model/MinerSettings';
import * as crypto from 'node:crypto';

export abstract class Miner<S extends MinerSettings> {
    public abstract connect(): Promise<void>;

    constructor(
        public readonly settings: S
    ) {
        if(!settings.id) {
            this.settings.id = crypto.randomUUID();
        }
    }

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