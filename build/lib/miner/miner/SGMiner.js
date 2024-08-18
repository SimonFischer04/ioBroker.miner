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
var SGMiner_exports = {};
__export(SGMiner_exports, {
  SGMiner: () => SGMiner
});
module.exports = __toCommonJS(SGMiner_exports);
var import_PollingMiner = require("./PollingMiner");
var import_MinerFeature = require("../model/MinerFeature");
var import_socket_utils = require("../../utils/socket-utils");
var SGMinerCommand = /* @__PURE__ */ ((SGMinerCommand2) => {
  SGMinerCommand2["stats"] = "summary+coin";
  return SGMinerCommand2;
})(SGMinerCommand || {});
class SGMiner extends import_PollingMiner.PollingMiner {
  async init() {
    await super.init();
    return Promise.resolve();
  }
  start() {
    this.logger.error("start() not (yet) implemented");
    return Promise.resolve();
  }
  async fetchStats() {
    try {
      const response = await this.sendCommand("summary+coin" /* stats */, "", true);
      return {
        raw: response
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }
  stop() {
    this.logger.error("stop() not (yet) implemented");
    return Promise.resolve();
  }
  getSupportedFeatures() {
    return [
      import_MinerFeature.MinerFeatureKey.rawStats
    ];
  }
  getLoggerName() {
    return `${super.getLoggerName()}SGMiner[${this.settings.host}:${this.settings.port}]`;
  }
  getCliArgs() {
    return [
      "--api_listen=0.0.0.0:4028"
    ];
  }
  async sendCommand(command, parameter = "", expectResponse = true) {
    return (0, import_socket_utils.sendSocketCommand)(this.logger, this.settings.host, this.settings.port, {
      command,
      parameter
    }, expectResponse);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SGMiner
});
//# sourceMappingURL=SGMiner.js.map
