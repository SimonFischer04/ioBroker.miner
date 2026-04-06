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
var import_CGMiner = require("./CGMiner");
var import_array_utils = require("../../utils/array-utils");
class TeamRedMiner extends import_PollingMiner.PollingMiner {
  claymoreMiner;
  cgMiner;
  /**
   *
   * @param settings - TeamRedMiner-specific configuration
   */
  constructor(settings) {
    var _a, _b;
    super(settings);
    if (settings.pollInterval !== ((_a = settings.cgminer) == null ? void 0 : _a.pollInterval) || settings.pollInterval !== ((_b = settings.claymore) == null ? void 0 : _b.pollInterval)) {
      this.logger.error("pollInterval must be the same for all miners");
    }
    this.claymoreMiner = new import_ClaymoreMiner.ClaymoreMiner(settings.claymore);
    this.cgMiner = new import_CGMiner.CGMiner(settings.cgminer);
  }
  /**
   *
   */
  async init() {
    await super.init();
  }
  /**
   *
   */
  async start() {
    await this.claymoreMiner.start();
  }
  /**
   *
   */
  async fetchStats() {
    const claymoreStats = await this.claymoreMiner.fetchStats();
    const cgStats = await this.cgMiner.fetchStats();
    return {
      raw: {
        claymore: claymoreStats.raw,
        cgminer: cgStats.raw
      },
      version: claymoreStats.version,
      totalHashrate: claymoreStats.totalHashrate
    };
  }
  /**
   *
   */
  async stop() {
    await this.claymoreMiner.stop();
  }
  /**
   *
   */
  async close() {
    await this.claymoreMiner.close();
  }
  /**
   *
   */
  getSupportedFeatures() {
    return (0, import_array_utils.distinct)([...this.claymoreMiner.getSupportedFeatures(), ...this.cgMiner.getSupportedFeatures()]);
  }
  /**
   *
   */
  getCliArgs() {
    return [
      ...this.claymoreMiner.getCliArgs(),
      // cgminer official syntax is '--api-listen', but teamRedMiner uses '--api_listen'
      ...this.cgMiner.getCliArgs().map((arg) => arg.replace("--api-listen", "--api_listen"))
    ];
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TeamRedMiner
});
//# sourceMappingURL=TeamRedMiner.js.map
