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
var import_CGMinerApiTypes = require("../model/CGMinerApiTypes");
const MHS_TO_HS = 1e6;
class SGMiner extends import_PollingMiner.PollingMiner {
  /**
   *
   */
  async init() {
    await super.init();
    return Promise.resolve();
  }
  /**
   *
   */
  start() {
    this.logger.error("start() not (yet) implemented");
    return Promise.resolve();
  }
  /**
   *
   */
  async fetchStats() {
    try {
      const response = await this.sendCommand(
        [import_CGMinerApiTypes.CGMinerCommand.summary, import_CGMinerApiTypes.CGMinerCommand.version],
        "",
        true
      );
      return this.parseSummaryVersionResponse(response);
    } catch (e) {
      return Promise.reject(e instanceof Error ? e : new Error(String(e)));
    }
  }
  /**
   *
   */
  stop() {
    this.logger.error("stop() not (yet) implemented");
    return Promise.resolve();
  }
  /**
   *
   */
  getSupportedFeatures() {
    return [import_MinerFeature.MinerFeatureKey.version, import_MinerFeature.MinerFeatureKey.stats, import_MinerFeature.MinerFeatureKey.rawStats];
  }
  /**
   *
   */
  getLoggerName() {
    return `${super.getLoggerName()}SGMiner[${this.settings.host}:${this.settings.port}]`;
  }
  /**
   *
   */
  getCliArgs() {
    return [`--api_listen=0.0.0.0:${this.settings.port}`];
  }
  /**
   * Send a command to the miner via the CGMiner-compatible socket API.
   *
   * @param command - the command to send
   * @param parameter - optional parameter string
   * @param expectResponse - whether to wait for and return a response
   */
  async sendCommand(command, parameter = "", expectResponse = true) {
    const combinedCommand = !Array.isArray(command) ? command : command.join("+");
    return (0, import_socket_utils.sendSocketCommand)(
      this.logger,
      this.settings.host,
      this.settings.port,
      {
        command: combinedCommand,
        parameter
      },
      expectResponse
    );
  }
  // public to allow unit tests
  /**
   * Parse a CGMiner "summary+version" combined response into {@link MinerStats}.
   *
   * @param response - raw combined API response
   * @returns parsed miner statistics
   */
  parseSummaryVersionResponse(response) {
    var _a, _b, _c, _d, _e, _f;
    const summary = (_c = (_b = (_a = response.summary) == null ? void 0 : _a[0]) == null ? void 0 : _b.SUMMARY) == null ? void 0 : _c[0];
    const version = (_f = (_e = (_d = response.version) == null ? void 0 : _d[0]) == null ? void 0 : _e.VERSION) == null ? void 0 : _f[0];
    const totalHashrate = summary ? summary["MHS 5s"] * MHS_TO_HS : void 0;
    const acceptedShares = summary == null ? void 0 : summary.Accepted;
    const rejectedShares = summary == null ? void 0 : summary.Rejected;
    return {
      raw: response,
      version: version == null ? void 0 : version.CGMiner,
      totalHashrate,
      acceptedShares,
      rejectedShares
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SGMiner
});
//# sourceMappingURL=SGMiner.js.map
