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
var TeamRedMiner_exports = {};
__export(TeamRedMiner_exports, {
  TeamRedMiner: () => TeamRedMiner
});
module.exports = __toCommonJS(TeamRedMiner_exports);
var import_PollingMiner = require("./PollingMiner");
var import_ClaymoreMiner = require("./ClaymoreMiner");
var import_SGMiner = require("./SGMiner");
class TeamRedMiner extends import_PollingMiner.PollingMiner {
  // TODO: actually does not support full claymore api
  // TODO: sgminer api
  claymoreMiner;
  sgMiner;
  constructor(settings) {
    super(settings);
    if (settings.pollInterval !== settings.sg.pollInterval || settings.pollInterval !== settings.claymore.pollInterval) {
      throw new Error("pollInterval must be the same for all miners");
    }
    this.claymoreMiner = new import_ClaymoreMiner.ClaymoreMiner(settings.claymore);
    this.sgMiner = new import_SGMiner.SGMiner(settings.sg);
  }
  async init() {
    await super.init();
  }
  async start() {
    await this.claymoreMiner.start();
  }
  async fetchStats() {
    const claymoreStats = await this.claymoreMiner.fetchStats();
    return claymoreStats;
  }
  async stop() {
    await this.claymoreMiner.stop();
  }
  async close() {
    await this.claymoreMiner.close();
  }
  getSupportedFeatures() {
    return [
      ...this.claymoreMiner.getSupportedFeatures()
    ];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TeamRedMiner
});
//# sourceMappingURL=TeamRedMiner.js.map
