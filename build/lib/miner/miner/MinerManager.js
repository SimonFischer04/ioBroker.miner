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
class MinerManager {
  miners = [];
  async init(settings) {
    const miner = (0, import_MinerFactory.createMiner)(settings);
    this.miners.push(miner);
    await miner.connect();
    return miner;
  }
  async close() {
    for (const miner of this.miners) {
      await miner.close();
    }
  }
  getMinerById(id) {
    return this.miners.find((miner) => miner.settings.id === id);
  }
  async startMiner(id) {
    const miner = this.getMinerById(id);
    if (!miner) {
      throw new Error(`miner with id ${id} not found`);
    }
    await miner.start();
  }
  async stopMiner(id) {
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
