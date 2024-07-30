import {MinerSettings} from '../../lib/miner/model/MinerSettings';
import {Category, categoryKeys} from '../../lib/miner/model/Category';

/*
    this adapter needs/stores more info per miner than is strictly required if just using the lib, so create su-types
 */

// settings / native part of iobroker 'device'- objects
export interface IOBrokerDeviceSettings {
    category: Category;
}

export interface IOBrokerMinerSettings extends IOBrokerDeviceSettings {
    category: (typeof categoryKeys)[0];
    name: string;
    host: string;
    mac: string;

    // adapter allows to temporarily disable handling a device (no connection created to the device, controls do nothing, ...)
    // does not really make sense in a lib context, as then it also just not initialise the device
    enabled: boolean;

    settings: MinerSettings;
}

export interface IOBrokerPoolSettings extends IOBrokerDeviceSettings {
    category: (typeof categoryKeys)[1];
    // TODO
}

// TODO: check everywhere this is used
export function isMiner(settings: IOBrokerDeviceSettings): settings is IOBrokerMinerSettings {
    return settings.category === 'miner';
}