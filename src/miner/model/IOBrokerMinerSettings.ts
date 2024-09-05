import {
    ClaymoreMinerSettings, IceRiverOcMinerSettings,
    MinerSettings,
    TeamRedMinerSettings,
    XMRigSettings
} from '../../lib/miner/model/MinerSettings';
import {Category, categoryKeys} from '../../lib/miner/model/Category';
import {Logger} from '../../lib/miner/model/Logger';

const logger = Logger.getLogger('IOBrokerMinerSettings');

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
    mac: string; // used as object id

    // adapter allows to temporarily disable handling a device (no connection created to the device, controls do nothing, ...)
    // does not really make sense in a lib context, as then it is also possible to just not initialise the device
    enabled: boolean;

    settings: MinerSettings;
}

export interface IOBrokerPoolSettings extends IOBrokerDeviceSettings {
    category: (typeof categoryKeys)[1];
    // TODO
}

// TODO: check everywhere this is used
export function isMiner(settings?: Partial<IOBrokerDeviceSettings>): settings is IOBrokerMinerSettings {
    return settings?.category === 'miner';
}

/**
 * Encrypt sensitive data in the settings
 * @param settings - the settings to encrypt
 * @param encryptFunction - the function to encrypt a value
 */
export function encryptDeviceSettings(settings: IOBrokerDeviceSettings, encryptFunction: (value: string) => string): IOBrokerDeviceSettings {
    if (!isMiner(settings)) { // TODO: pool support
        logger.error(`category ${settings.category} is not yet supported.`);
        return settings;
    }

    // TODO: cleaner way to do this?
    switch (settings.settings.minerType) {
        case 'teamRedMiner': {
            const trmSettings = settings.settings as TeamRedMinerSettings;
            trmSettings.claymore.password = encryptFunction(trmSettings.claymore.password);
            break;
        }

        case 'claymoreMiner': {
            const claymoreSettings = settings.settings as ClaymoreMinerSettings;
            claymoreSettings.password = encryptFunction(claymoreSettings.password);
            break;
        }

        case 'xmRig': {
            const xmRigSettings = settings.settings as XMRigSettings;
            xmRigSettings.password = encryptFunction(xmRigSettings.password);
            break
        }

        case 'iceRiverOcMiner': {
            const iceRiverOcSettings = settings.settings as IceRiverOcMinerSettings;
            iceRiverOcSettings.password = encryptFunction(iceRiverOcSettings.password);
            break
        }

        default: {
            break;
        }
    }

    return settings;
}

/**
 * Decrypt sensitive data in the settings
 * @param settings - the settings to decrypt
 * @param decryptFunction - the function to decrypt a value
 */
export function decryptDeviceSettings(settings: IOBrokerDeviceSettings, decryptFunction: (value: string) => string): IOBrokerDeviceSettings {
    if (!isMiner(settings)) { // TODO: pool support
        logger.error(`category ${settings.category} is not yet supported.`);
        return settings;
    }

    // TODO: cleaner way to do this?
    switch (settings.settings.minerType) {
        case 'teamRedMiner': {
            const trmSettings = settings.settings as TeamRedMinerSettings;
            trmSettings.claymore.password = decryptFunction(trmSettings.claymore.password);
            break;
        }

        case 'claymoreMiner': {
            const claymoreSettings = settings.settings as ClaymoreMinerSettings;
            claymoreSettings.password = decryptFunction(claymoreSettings.password);
            break;
        }

        case 'xmRig': {
            const xmRigSettings = settings.settings as XMRigSettings;
            xmRigSettings.password = decryptFunction(xmRigSettings.password);
            break;
        }

        case 'iceRiverOcMiner': {
            const iceRiverOcSettings = settings.settings as IceRiverOcMinerSettings;
            iceRiverOcSettings.password = decryptFunction(iceRiverOcSettings.password);
            break;
        }

        default: {
            break;
        }
    }

    return settings;
}