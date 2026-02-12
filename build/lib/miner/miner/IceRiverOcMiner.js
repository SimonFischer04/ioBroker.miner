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
var IceRiverOcMiner_exports = {};
__export(IceRiverOcMiner_exports, {
  IceRiverOcMiner: () => IceRiverOcMiner
});
module.exports = __toCommonJS(IceRiverOcMiner_exports);
var import_PollingMiner = require("./PollingMiner");
var import_MinerFeature = require("../model/MinerFeature");
var import_http_utils = require("../../utils/http-utils");
var IceRiverOcEndpoint = /* @__PURE__ */ ((IceRiverOcEndpoint2) => {
  IceRiverOcEndpoint2["sleep"] = "api/machine/sleep";
  IceRiverOcEndpoint2["wake"] = "api/machine/wake";
  IceRiverOcEndpoint2["overview"] = "api/overview";
  return IceRiverOcEndpoint2;
})(IceRiverOcEndpoint || {});
class IceRiverOcMiner extends import_PollingMiner.PollingMiner {
  /**
   *
   */
  async start() {
    await this.sendHTTPRequest("api/machine/wake" /* wake */, "GET");
  }
  /**
   *
   */
  async fetchStats() {
    const responseBody = await this.sendHTTPRequest("api/overview" /* overview */, "GET");
    return {
      raw: responseBody
    };
  }
  /**
   *
   */
  async stop() {
    await this.sendHTTPRequest("api/machine/sleep" /* sleep */, "GET");
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
    return `${super.getLoggerName()}IceRiverOcMiner[${this.settings.host}:${this.settings.port}]`;
  }
  /**
   *
   */
  getCliArgs() {
    return [];
  }
  async sendHTTPRequest(endpoint, httpMethod, body) {
    return (0, import_http_utils.sendGenericHTTPRequest)(
      "https",
      this.settings.host,
      this.settings.port,
      this.settings.password,
      this.logger,
      endpoint,
      httpMethod,
      body
    );
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  IceRiverOcMiner
});
//# sourceMappingURL=IceRiverOcMiner.js.map
