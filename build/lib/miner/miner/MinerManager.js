"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var MinerManager_exports = {};
__export(MinerManager_exports, {
  MinerManager: () => MinerManager
});
module.exports = __toCommonJS(MinerManager_exports);
var import_MinerFactory = require("./MinerFactory");
var import_Logger = require("../model/Logger");
const logger = import_Logger.Logger.getLogger("MinerManager");
class MinerManager {
  miners = [];
  async init(settings) {
    logger.info(`initializing miner with id ${settings.id}`);
    const miner = (0, import_MinerFactory.createMiner)(settings);
    this.miners.push(miner);
    await miner.init();
    return miner;
  }
  async close(id) {
    logger.info(`unloading miner with id ${id}`);
    if (id == null) {
      logger.error("id must be provided");
      return;
    }
    const miner = this.getMinerById(id);
    if (!miner) {
      logger.error(`miner with id ${id} not found`);
      return;
    }
    await miner.close();
    this.miners.splice(this.miners.indexOf(miner), 1);
  }
  async closeAll() {
    logger.log("unloading all miners");
    for (const miner of this.miners) {
      await miner.close();
    }
    this.miners.splice(0, this.miners.length);
  }
  getMinerById(id) {
    return this.miners.find((miner) => miner.settings.id === id);
  }
  hasMiner(id) {
    return this.getMinerById(id) != null;
  }
  async startMiner(id) {
    logger.info(`starting miner with id ${id}`);
    const miner = this.getMinerById(id);
    if (!miner) {
      throw new Error(`miner with id ${id} not found`);
    }
    await miner.start();
  }
  async stopMiner(id) {
    logger.info(`stopping miner with id ${id}`);
    const miner = this.getMinerById(id);
    if (!miner) {
      throw new Error(`miner with id ${id} not found`);
    }
    await miner.stop();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MinerManager
});
//# sourceMappingURL=MinerManager.js.map
