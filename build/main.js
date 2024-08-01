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
var import_MinerObject = require("./miner/model/MinerObject");
var import_Logger = require("./lib/miner/model/Logger");
var import_Level = require("./lib/miner/model/Level");
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
    await this.setObjectNotExistsAsync("testVariable", {
      type: "state",
      common: {
        name: "testVariable",
        type: "boolean",
        role: "indicator",
        read: true,
        write: true
      },
      native: {}
    });
    this.subscribeStates("testVariable");
    await this.setStateAsync("testVariable", true);
    await this.setStateAsync("testVariable", { val: true, ack: true });
    await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });
    await this.tryKnownDevices();
    this.subscribeStates("miner.*.control.*");
  }
  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   */
  async onUnload(callback) {
    try {
      await this.minerManager.close();
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
        case import_MinerObject.MinerObject.running: {
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
  async addDevice(settings) {
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      this.log.error(`category ${settings.category} is not yet supported.`);
      return;
    }
    const id = this.getDeviceObjectId(settings);
    await this.extendObject(id, {
      type: "device",
      common: {
        name: settings.name || settings.host
      },
      native: settings
    });
    const obj = await this.getObjectAsync(id);
    this.log.debug(`created new device obj: ${JSON.stringify(obj)}`);
    await this.initDevice(obj);
  }
  async initDevice(device) {
    const settings = device.native;
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      this.log.error(`tryKnownDevices category ${settings.category} not yet supported`);
      return;
    }
    await this.createDeviceStateObjects(settings);
    if (!settings.enabled) {
      this.log.info(`device ${settings.name} is disabled`);
      return;
    }
    await this.minerManager.init(settings.settings);
  }
  async createDeviceStateObjects(settings) {
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      this.log.error(`createDeviceStateObjects category ${settings.category} not yet supported`);
      return;
    }
    await this.extendObject(`${this.getDeviceObjectId(settings)}.${import_MinerObject.MinerObject.controls}`, {
      type: "channel",
      common: {
        name: "device controls"
      }
    });
    await this.extendObject(`${this.getDeviceObjectId(settings)}.${import_MinerObject.MinerObject.info}`, {
      type: "channel",
      common: {
        name: "device information"
      }
    });
    await this.extendObject(`${this.getDeviceObjectId(settings)}.${import_MinerObject.MinerObject.running}`, {
      type: "state",
      common: {
        name: "mining running",
        type: "boolean",
        read: true,
        write: true
      }
    });
  }
  getDeviceObjectId(settings) {
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      this.log.error(`category ${settings.category} is not yet supported.`);
      return "TODO";
    }
    return `${settings.category}.${settings.mac.replace(/:/g, "")}`;
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
