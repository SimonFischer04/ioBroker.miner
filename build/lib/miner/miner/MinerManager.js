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
  /**
   *
   * @param settings - the miner configuration to initialize
   */
  async init(settings) {
    logger.info(`[init] initializing miner with id ${settings.id}`);
    const miner = (0, import_MinerFactory.createMiner)(settings);
    this.miners.push(miner);
    await miner.init();
    return miner;
  }
  /**
   *
   * @param id - the miner id to close
   */
  async close(id) {
    logger.info(`[close] unloading miner with id ${id}`);
    if (id == null) {
      logger.error("[close] id must be provided");
      return;
    }
    const miner = this.getMinerById(id);
    if (!miner) {
      logger.error(`[close] miner with id ${id} not found`);
      return;
    }
    await miner.close();
    this.miners.splice(this.miners.indexOf(miner), 1);
  }
  /**
   *
   */
  async closeAll() {
    logger.log("[closeAll] unloading all miners");
    for (const miner of this.miners) {
      await miner.close();
    }
    this.miners.splice(0, this.miners.length);
  }
  /**
   *
   * @param id - the miner id to look up
   */
  getMinerById(id) {
    return this.miners.find((miner) => miner.settings.id === id);
  }
  /**
   *
   * @param id - the miner id to check
   */
  hasMiner(id) {
    return this.getMinerById(id) != null;
  }
  /**
   *
   * @param id - the miner id to start
   */
  async startMiner(id) {
    logger.info(`[startMiner] starting miner with id ${id}`);
    const miner = this.getMinerById(id);
    if (!miner) {
      logger.warn(`[startMiner] miner with id ${id} not found`);
      return;
    }
    await miner.start();
  }
  /**
   *
   * @param id - the miner id to stop
   */
  async stopMiner(id) {
    logger.info(`[stopMiner] stopping miner with id ${id}`);
    const miner = this.getMinerById(id);
    if (!miner) {
      logger.warn(`[stopMiner] miner with id ${id} not found`);
      return;
    }
    await miner.stop();
  }
  /**
   * Set the active performance profile on a miner.
   *
   * @param id - the miner id
   * @param profile - the profile name to activate
   */
  async setProfile(id, profile) {
    logger.info(`[setProfile] setting profile "${profile}" on miner with id ${id}`);
    const miner = this.getMinerById(id);
    if (!miner) {
      logger.warn(`[setProfile] miner with id ${id} not found`);
      return;
    }
    await miner.setProfile(profile);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MinerManager
});
//# sourceMappingURL=MinerManager.js.map
