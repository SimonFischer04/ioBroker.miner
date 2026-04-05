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
var BOSMiner_exports = {};
__export(BOSMiner_exports, {
  BOSMiner: () => BOSMiner
});
module.exports = __toCommonJS(BOSMiner_exports);
var import_MinerFeature = require("../model/MinerFeature");
var import_SGMiner = require("./SGMiner");
var BOSMinerCommand = /* @__PURE__ */ ((BOSMinerCommand2) => {
  BOSMinerCommand2["pause"] = "pause";
  BOSMinerCommand2["resume"] = "resume";
  return BOSMinerCommand2;
})(BOSMinerCommand || {});
class BOSMiner extends import_SGMiner.SGMiner {
  /**
   *
   */
  async start() {
    await this.sendCommand("resume" /* resume */, "", false);
  }
  /**
   *
   */
  async stop() {
    await this.sendCommand("pause" /* pause */, "", false);
  }
  /**
   *
   */
  getSupportedFeatures() {
    const unsupportedFeatures = [import_MinerFeature.MinerFeatureKey.cliArgs];
    return [
      ...super.getSupportedFeatures().filter((feature) => !unsupportedFeatures.includes(feature)),
      import_MinerFeature.MinerFeatureKey.running
    ];
  }
  /**
   *
   */
  getLoggerName() {
    return `${super.getLoggerName()}BOSMiner[${this.settings.host}:${this.settings.port}]`;
  }
  /**
   *
   */
  getCliArgs() {
    return [];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BOSMiner
});
//# sourceMappingURL=BOSMiner.js.map
