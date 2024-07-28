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
  onStateChange(id, state) {
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
      if (this.deviceManagement) {
        this.deviceManagement.debugging();
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
    await this.minerManager.init(settings.settings);
  }
  async createDeviceStateObjects(settings) {
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      this.log.error(`createDeviceStateObjects category ${settings.category} not yet supported`);
      return;
    }
  }
  getDeviceObjectId(settings) {
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      this.log.error(`category ${settings.category} is not yet supported.`);
      return "TODO";
    }
    return `${settings.category}.${settings.mac.replace(/:/g, "")}`;
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
