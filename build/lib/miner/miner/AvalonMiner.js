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
var import_PollingMiner = require("./PollingMiner");
var import_MinerFeature = require("../model/MinerFeature");
var import_socket_utils = require("../../utils/socket-utils");
var AvalonMinerCommand = /* @__PURE__ */ ((AvalonMinerCommand2) => {
  AvalonMinerCommand2["stats"] = "summary+stats";
  AvalonMinerCommand2["ascset"] = "ascset";
  return AvalonMinerCommand2;
})(AvalonMinerCommand || {});
var AvalonMinerParameter = /* @__PURE__ */ ((AvalonMinerParameter2) => {
  AvalonMinerParameter2["softon"] = "0,softon,1";
  AvalonMinerParameter2["softoff"] = "0,softoff,1";
  return AvalonMinerParameter2;
})(AvalonMinerParameter || {});
class AvalonMiner extends import_PollingMiner.PollingMiner {
  /**
   *
   */
  async start() {
    const futureTimestamp = Math.floor(Date.now() / 1e3) + 5;
    await this.sendCommand("ascset" /* ascset */, `${"0,softon,1" /* softon */}:${futureTimestamp}`, false);
  }
  /**
   *
   */
  async fetchStats() {
    try {
      const response = await this.sendCommand("summary+stats" /* stats */, "", true);
      return {
        raw: response
      };
    } catch (e) {
      return Promise.reject(e instanceof Error ? e : new Error(String(e)));
    }
  }
  /**
   *
   */
  async stop() {
    const futureTimestamp = Math.floor(Date.now() / 1e3) + 5;
    await this.sendCommand("ascset" /* ascset */, `${"0,softoff,1" /* softoff */}:${futureTimestamp}`, false);
  }
  /**
   *
   */
  getSupportedFeatures() {
    return [import_MinerFeature.MinerFeatureKey.running, import_MinerFeature.MinerFeatureKey.rawStats];
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
  async sendCommand(command, parameter = "", expectResponse = true) {
    return (0, import_socket_utils.sendSocketCommand)(
      this.logger,
      this.settings.host,
      this.settings.port,
      {
        command,
        parameter
      },
      expectResponse
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AvalonMiner
});
//# sourceMappingURL=AvalonMiner.js.map
