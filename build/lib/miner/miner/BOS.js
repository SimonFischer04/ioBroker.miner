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
var BOS_exports = {};
__export(BOS_exports, {
  BOS: () => BOS
});
module.exports = __toCommonJS(BOS_exports);
var import_MinerSettings = require("../model/MinerSettings");
var import_BosApiClient = require("../api/BosApiClient");
var import_MinerFeature = require("../model/MinerFeature");
var import_PollingMiner = require("./PollingMiner");
const GHASH_TO_HASH = 1e9;
const TERAHASH_TO_HASH = 1e12;
class BOS extends import_PollingMiner.PollingMiner {
  client;
  /**
   *
   */
  async init() {
    this.client = this.createClient();
    await super.init();
  }
  /**
   *
   */
  async start() {
    await this.getClient().resumeMining();
  }
  /**
   *
   */
  async stop() {
    await this.getClient().pauseMining();
  }
  /**
   *
   * @param powerTarget
   */
  async setPowerTarget(powerTarget) {
    await this.getClient().setPowerTarget(powerTarget);
  }
  /**
   *
   */
  async fetchStats() {
    const details = await this.getClient().getMinerDetails();
    const stats = await this.getClient().getMinerStats();
    const apiVersion = await this.getClient().getApiVersion();
    const tunerState = await this.getClient().getTunerState();
    return this.parseBosApiResponse(details, stats, apiVersion, tunerState);
  }
  /**
   *
   */
  async close() {
    var _a;
    (_a = this.client) == null ? void 0 : _a.close();
    this.client = void 0;
    await super.close();
  }
  /**
   *
   */
  getSupportedFeatures() {
    return [
      import_MinerFeature.MinerFeatureKey.running,
      import_MinerFeature.MinerFeatureKey.version,
      import_MinerFeature.MinerFeatureKey.firmwareVersion,
      import_MinerFeature.MinerFeatureKey.powerTarget,
      import_MinerFeature.MinerFeatureKey.stats,
      import_MinerFeature.MinerFeatureKey.rawStats
    ];
  }
  /**
   *
   */
  getLoggerName() {
    return `${super.getLoggerName()}BOS[${this.settings.host}:${this.settings.port}]`;
  }
  /**
   *
   */
  getCliArgs() {
    return [];
  }
  /**
   *
   * @param details
   * @param stats
   * @param apiVersion
   * @param tunerState
   */
  parseBosApiResponse(details, stats, apiVersion, tunerState) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
    const hashrate = (_a = stats.minerStats) == null ? void 0 : _a.realHashrate;
    const totalHashrate = ((_b = hashrate == null ? void 0 : hashrate.last_5s) == null ? void 0 : _b.gigahashPerSecond) !== void 0 ? hashrate.last_5s.gigahashPerSecond * GHASH_TO_HASH : void 0;
    const power = (_d = (_c = stats.powerStats) == null ? void 0 : _c.approximatedConsumption) == null ? void 0 : _d.watt;
    const dynamicPowerTarget = (_f = (_e = tunerState == null ? void 0 : tunerState.powerTargetModeState) == null ? void 0 : _e.currentTarget) == null ? void 0 : _f.watt;
    const joulePerTerahash = (_h = (_g = stats.powerStats) == null ? void 0 : _g.efficiency) == null ? void 0 : _h.joulePerTerahash;
    return {
      raw: { details, stats, apiVersion, tunerState },
      version: formatApiVersion(apiVersion),
      firmwareVersion: (_i = details.bosVersion) == null ? void 0 : _i.current,
      totalHashrate,
      power,
      dynamicPowerTarget,
      efficiency: joulePerTerahash !== void 0 && joulePerTerahash > 0 ? TERAHASH_TO_HASH / joulePerTerahash : void 0,
      acceptedShares: (_j = stats.poolStats) == null ? void 0 : _j.acceptedShares,
      rejectedShares: (_k = stats.poolStats) == null ? void 0 : _k.rejectedShares
    };
  }
  getClient() {
    var _a;
    (_a = this.client) != null ? _a : this.client = this.createClient();
    return this.client;
  }
  createClient() {
    return new import_BosApiClient.BosApiClient({
      host: this.settings.host,
      port: this.settings.port,
      secure: this.settings.secure,
      timeoutMs: this.settings.timeoutMs,
      username: this.settings.username || import_MinerSettings.BOS_DEFAULT_USERNAME,
      password: this.settings.password || import_MinerSettings.BOS_DEFAULT_PASSWORD
    });
  }
}
function formatApiVersion(version) {
  var _a, _b, _c;
  if (!version) {
    return void 0;
  }
  const baseVersion = `${(_a = version.major) != null ? _a : 0}.${(_b = version.minor) != null ? _b : 0}.${(_c = version.patch) != null ? _c : 0}`;
  const preRelease = version.pre ? `-${version.pre}` : "";
  const build = version.build ? `+${version.build}` : "";
  return `${baseVersion}${preRelease}${build}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BOS
});
//# sourceMappingURL=BOS.js.map
