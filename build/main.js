"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var main_exports = {};
__export(main_exports, {
  MinerAdapter: () => MinerAdapter
});
module.exports = __toCommonJS(main_exports);
var utils = __toESM(require("@iobroker/adapter-core"));
var import_MinerAdapterDeviceManagement = __toESM(require("./lib/MinerAdapterDeviceManagement"));
var import_Category = require("./lib/miner/model/Category");
var import_MinerManager = require("./lib/miner/miner/MinerManager");
var import_IOBrokerMinerSettings = require("./miner/model/IOBrokerMinerSettings");
var import_Level = require("./lib/miner/model/Level");
var import_MinerFeature = require("./lib/miner/model/MinerFeature");
var import_MinerFactory = require("./lib/miner/miner/MinerFactory");
var import_Logger = require("./lib/miner/model/Logger");
class MinerAdapter extends utils.Adapter {
  deviceManagement;
  minerManager = new import_MinerManager.MinerManager();
  constructor(options = {}) {
    super({
      ...options,
      name: "miner"
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.deviceManagement = new import_MinerAdapterDeviceManagement.default(this);
  }
  /**
   * Is called when databases are connected and adapter received configuration.
   */
  async onReady() {
    this.setupMinerLib();
    await this.setState("info.connection", false, true);
    await this.createBasicObjectStructure();
    this.log.info("aconfig option1: " + this.config.option1);
    this.log.info("config option2: " + this.config.option2);
    console.log("testABC");
    await this.tryKnownDevices();
    this.subscribeStates("miner.*.control.*");
  }
  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   */
  async onUnload(callback) {
    try {
      await this.minerManager.closeAll();
      if (this.deviceManagement) {
        await this.deviceManagement.close();
      }
      callback();
    } catch (e) {
      callback();
    }
  }
  // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
  // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
  // /**
  //  * Is called if a subscribed object changes
  //  */
  // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
  //     if (obj) {
  //         // The object was changed
  //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
  //     } else {
  //         // The object was deleted
  //         this.log.info(`object ${id} deleted`);
  //     }
  // }
  /**
   * Is called if a subscribed state changes
   */
  async onStateChange(id, state) {
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
      if (state.ack)
        return;
      const parts = id.split(".");
      if (parts.length < 5) {
        this.log.error(`invalid state id: ${id}`);
        return;
      }
      const deviceObjectId = parts.slice(0, 4).join(".");
      const obj = await this.getObjectAsync(deviceObjectId);
      if (obj === null || obj === void 0) {
        this.log.warn(`Object ${deviceObjectId} not found`);
        return;
      }
      const deviceSettings = obj.native;
      if (!(0, import_IOBrokerMinerSettings.isMiner)(deviceSettings)) {
        this.log.warn(`category ${deviceSettings.category} not yet supported`);
        return;
      }
      const minerObjectId = parts.slice(4).join(".");
      switch (minerObjectId) {
        case (0, import_MinerFeature.getMinerFeatureFullId)(import_MinerFeature.MinerFeatureKey.running): {
          this.log.debug(`running state changed to ${state.val}`);
          if (deviceSettings.settings.id === void 0) {
            this.log.error(`device ${deviceSettings.name} has no id`);
            return;
          }
          if (state.val) {
            await this.minerManager.startMiner(deviceSettings.settings.id);
          } else {
            await this.minerManager.stopMiner(deviceSettings.settings.id);
          }
          await this.setState(id, { val: state.val, ack: true });
          break;
        }
        default: {
          this.log.warn(`unknown handling of state ${id}`);
        }
      }
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
  // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
  // /**
  //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
  //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
  //  */
  // private onMessage(obj: ioBroker.Message): void {
  //     if (typeof obj === 'object' && obj.message) {
  //         if (obj.command === 'send') {
  //             // e.g. send email or pushover or whatever
  //             this.log.info('send command');
  //             // Send response in callback if required
  //             if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
  //         }
  //     }
  // }
  async createBasicObjectStructure() {
    for (const key of import_Category.categoryKeys) {
      await this.setObjectNotExistsAsync(key, {
        type: "folder",
        common: {
          // TODO: translate(key+"Folder") oda so
          name: key
        },
        native: {}
      });
    }
  }
  // Try to initialise and connect to already known devices
  async tryKnownDevices() {
    const knownDevices = await this.getDevicesAsync();
    for (const device of knownDevices) {
      await this.initDevice(device);
    }
  }
  async configureDeviceObject(settings) {
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      this.log.error(`category ${settings.category} is not yet supported.`);
      return;
    }
    const id = this.getDeviceObjectId(settings);
    this.log.debug(`extended object ${id} with: ${JSON.stringify(settings)}`);
    await this.extendObject(id, {
      type: "device",
      common: {
        name: settings.name || settings.settings.host
      },
      native: (0, import_IOBrokerMinerSettings.encryptDeviceSettings)(settings, (value) => this.encrypt(value))
    });
    await this.extendObject(`${id}.empty`, {
      type: "state",
      common: {
        name: "empty",
        type: "string",
        read: true,
        write: true,
        expert: true
      }
    });
    const obj = await this.getObjectAsync(id);
    this.log.debug(`configureDeviceObject: ${JSON.stringify(obj)}`);
    return obj;
  }
  async addDevice(settings) {
    const obj = await this.configureDeviceObject(settings);
    if (obj == null) {
      this.log.error(`could not create device object for ${JSON.stringify(settings)}`);
      return;
    }
    await this.initDevice(obj);
  }
  async updateDevice(settings) {
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      this.log.error(`category ${settings.category} is not yet supported.`);
      return;
    }
    if (!await this.tryCloseMiner(settings)) {
      this.log.error(`updateDevice could not close miner ${settings.settings.id}`);
      return;
    }
    await this.addDevice(settings);
  }
  /**
   * Deletes a device
   *
   * @param deviceId - The ioBroker-object-id of the device to delete
   */
  async delDevice(deviceId) {
    this.log.info(`deleteDevice device ${deviceId}`);
    const obj = await this.getObjectAsync(deviceId);
    if (obj == null) {
      this.log.error(`deleteDevice device ${deviceId} not found`);
      return false;
    }
    const settings = (0, import_IOBrokerMinerSettings.decryptDeviceSettings)(obj.native, (value) => this.decrypt(value));
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      this.log.error(`deleteDevice category ${obj.native.category} not yet supported`);
      return false;
    }
    if (!await this.tryCloseMiner(settings)) {
      this.log.error(`delDevice could not close miner ${settings.settings.id}`);
      return false;
    }
    await this.delObjectAsync(deviceId, { recursive: true });
    this.log.info(`${deviceId} deleted`);
    return true;
  }
  async tryCloseMiner(settings) {
    if (settings.settings.id === void 0) {
      this.log.error("tryCloseMiner: minerId is undefined");
      return false;
    }
    if (!settings.enabled) {
      this.log.debug(`tryCloseMiner: skipped miner close, because ${settings.settings.id} is disabled`);
      if (this.minerManager.hasMiner(settings.settings.id)) {
        this.log.error(`tryCloseMiner: this should not happen, miner ${settings.settings.id} is disabled but still in minerManager`);
        await this.minerManager.close(settings.settings.id);
      }
      return true;
    }
    await this.minerManager.close(settings.settings.id);
    return true;
  }
  async initDevice(device) {
    const settings = (0, import_IOBrokerMinerSettings.decryptDeviceSettings)(device.native, (value) => this.decrypt(value));
    this.log.info(`initialising device ${JSON.stringify(settings)}`);
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      this.log.error(`tryKnownDevices category ${settings.category} not yet supported`);
      return;
    }
    await this.createDeviceStateObjects(settings);
    if (!settings.enabled) {
      this.log.info(`device ${settings.name} is disabled`);
      return;
    }
    const miner = await this.minerManager.init(settings.settings);
    miner.subscribeToStats(async (stats) => {
      this.log.debug(`received stats: ${JSON.stringify(stats)}`);
      await this.processNewStats(miner, settings, stats);
    });
  }
  async processNewStats(miner, settings, stats) {
    for (const feature of miner.getSupportedFeatures()) {
      switch (feature) {
        case import_MinerFeature.MinerFeatureKey.rawStats: {
          await this.setState(this.getStateFullObjectId(settings, import_MinerFeature.MinerFeatureKey.rawStats), {
            val: JSON.stringify(stats.raw),
            ack: true
          });
          break;
        }
        case import_MinerFeature.MinerFeatureKey.version: {
          await this.setState(this.getStateFullObjectId(settings, import_MinerFeature.MinerFeatureKey.version), {
            val: stats.version,
            ack: true
          });
          break;
        }
        case import_MinerFeature.MinerFeatureKey.totalHashrate: {
          await this.setState(this.getStateFullObjectId(settings, import_MinerFeature.MinerFeatureKey.totalHashrate), {
            val: stats.totalHashrate,
            ack: true
          });
          break;
        }
      }
    }
  }
  async createDeviceStateObjects(settings) {
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      this.log.error(`createDeviceStateObjects category ${settings.category} not yet supported`);
      return;
    }
    await this.extendObject(`${this.getDeviceObjectId(settings)}.${import_MinerFeature.MinerFeatureCategory.control}`, {
      type: "channel",
      common: {
        name: "device controls"
      }
    });
    await this.extendObject(`${this.getDeviceObjectId(settings)}.${import_MinerFeature.MinerFeatureCategory.info}`, {
      type: "channel",
      common: {
        name: "device information"
      }
    });
    const dummyMiner = (0, import_MinerFactory.createMiner)(settings.settings);
    for (const featureKey of dummyMiner.getSupportedFeatures()) {
      const feature = import_MinerFeature.minerFeatures[featureKey];
      await this.extendObject(`${this.getStateFullObjectId(settings, featureKey)}`, {
        type: "state",
        common: {
          name: `${feature.label} - ${feature.description}`,
          type: feature.type,
          read: feature.readable,
          write: feature.writable,
          unit: feature.unit,
          expert: feature.advanced === true ? true : void 0
          // false needs to be passed in as undefined
        }
      });
    }
  }
  getDeviceObjectId(settings) {
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      this.log.error(`category ${settings.category} is not yet supported.`);
      return "<unsupported>";
    }
    return `${settings.category}.${settings.settings.id}`;
  }
  getStateFullObjectId(settings, featureKey) {
    return `${this.getDeviceObjectId(settings)}.${(0, import_MinerFeature.getMinerFeatureFullId)(featureKey)}`;
  }
  setupMinerLib() {
    import_Logger.Logger.setLogger({
      log: (level, message) => {
        switch (level) {
          case import_Level.Level.DEBUG:
            this.log.debug(message);
            break;
          case import_Level.Level.INFO:
            this.log.info(message);
            break;
          case import_Level.Level.NOTICE:
            this.log.info(message);
            break;
          case import_Level.Level.WARN:
            this.log.warn(message);
            break;
          case import_Level.Level.ERROR:
            this.log.error(message);
            break;
          case import_Level.Level.FATAL:
            this.log.error(message);
            break;
        }
      }
    });
  }
}
if (require.main !== module) {
  module.exports = (options) => new MinerAdapter(options);
} else {
  (() => new MinerAdapter())();
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MinerAdapter
});
//# sourceMappingURL=main.js.map
