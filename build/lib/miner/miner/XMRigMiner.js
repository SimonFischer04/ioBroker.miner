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
var XMRigMiner_exports = {};
__export(XMRigMiner_exports, {
  XMRigMiner: () => XMRigMiner
});
module.exports = __toCommonJS(XMRigMiner_exports);
var import_MinerFeature = require("../model/MinerFeature");
var import_PollingMiner = require("./PollingMiner");
var import_http_utils = require("../../utils/http-utils");
var XMRigEndpoint = /* @__PURE__ */ ((XMRigEndpoint2) => {
  XMRigEndpoint2["jsonRPC"] = "json_rpc";
  XMRigEndpoint2["summary"] = "2/summary";
  return XMRigEndpoint2;
})(XMRigEndpoint || {});
var XMRigJsonRPCMethod = /* @__PURE__ */ ((XMRigJsonRPCMethod2) => {
  XMRigJsonRPCMethod2["pause"] = "pause";
  XMRigJsonRPCMethod2["resume"] = "resume";
  XMRigJsonRPCMethod2["stop"] = "stop";
  return XMRigJsonRPCMethod2;
})(XMRigJsonRPCMethod || {});
class XMRigMiner extends import_PollingMiner.PollingMiner {
  async init() {
    await super.init();
    return Promise.resolve();
  }
  async start() {
    await this.sendJSONRPCCommand("resume" /* resume */);
  }
  async fetchStats() {
    const responseBody = await this.sendHTTPRequest("2/summary" /* summary */, "GET");
    return {
      raw: responseBody,
      version: responseBody.version,
      totalHashrate: responseBody.hashrate.total[0]
    };
  }
  async stop() {
    await this.sendJSONRPCCommand("pause" /* pause */);
  }
  getSupportedFeatures() {
    return [
      import_MinerFeature.MinerFeatureKey.running,
      import_MinerFeature.MinerFeatureKey.rawStats,
      import_MinerFeature.MinerFeatureKey.version,
      import_MinerFeature.MinerFeatureKey.totalHashrate
    ];
  }
  getLoggerName() {
    return `${super.getLoggerName()}XMRigMiner[${this.settings.host}:${this.settings.port}]`;
  }
  getCliArgs() {
    return [
      "--http-host ::",
      `--http-port ${this.settings.port}`,
      `--http-access-token ${this.settings.password}`,
      "--http-no-restricted"
    ];
  }
  async sendJSONRPCCommand(rpcMethod) {
    const responseBody = await this.sendHTTPRequest("json_rpc" /* jsonRPC */, "POST", {
      method: rpcMethod
    });
    if (responseBody.result.status !== "OK") {
      const error = `Error sending JSON-RPC command: ${JSON.stringify(responseBody)}`;
      this.logger.error(error);
      return Promise.reject(error);
    }
  }
  async sendHTTPRequest(endpoint, httpMethod, body) {
    return (0, import_http_utils.sendGenericHTTPRequest)("http", this.settings.host, this.settings.port, this.settings.password, this.logger, endpoint, httpMethod, body);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  XMRigMiner
});
//# sourceMappingURL=XMRigMiner.js.map
