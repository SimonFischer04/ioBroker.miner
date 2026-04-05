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
var AvalonMiner_exports = {};
__export(AvalonMiner_exports, {
  AvalonMiner: () => AvalonMiner
});
module.exports = __toCommonJS(AvalonMiner_exports);
var import_SGMiner = require("./SGMiner");
var import_MinerFeature = require("../model/MinerFeature");
var AvalonMinerCommand = /* @__PURE__ */ ((AvalonMinerCommand2) => {
  AvalonMinerCommand2["ascset"] = "ascset";
  return AvalonMinerCommand2;
})(AvalonMinerCommand || {});
var AvalonMinerParameter = /* @__PURE__ */ ((AvalonMinerParameter2) => {
  return AvalonMinerParameter2;
})(AvalonMinerParameter || {});
class AvalonMiner extends import_SGMiner.SGMiner {
  /**
   *
   */
  async start() {
    await super.start();
  }
  /**
   *
   */
  async stop() {
    await super.stop();
  }
  /**
   *
   */
  getSupportedFeatures() {
    return [
      // MinerFeatureKey.running,
      import_MinerFeature.MinerFeatureKey.rawStats
    ];
  }
  /**
   *
   */
  getLoggerName() {
    return `${super.getLoggerName()}AvalonMiner[${this.settings.host}:${this.settings.port}]`;
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
  AvalonMiner
});
//# sourceMappingURL=AvalonMiner.js.map
