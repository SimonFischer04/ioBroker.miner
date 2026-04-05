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
var import_CGMinerApiTypes = require("../model/CGMinerApiTypes");
var import_parse_utils = require("../../utils/parse-utils");
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
  async fetchStats() {
    try {
      const combinedCommand = [import_CGMinerApiTypes.CGMinerCommand.summary, import_CGMinerApiTypes.CGMinerCommand.version, import_CGMinerApiTypes.CGMinerCommand.stats].join("+");
      const response = await this.sendCommand(combinedCommand, "", true);
      return this.parseSummaryVersionStatsResponse(response);
    } catch (e) {
      return Promise.reject(e instanceof Error ? e : new Error(String(e)));
    }
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
      ...super.getSupportedFeatures()
      // MinerFeatureKey.running,
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
  // public to allow unit tests
  /**
   * Parse an Avalon `MM ID<n>` telemetry string into a key-value map.
   *
   * The string uses bracket-delimited pairs: `Key1[value1] Key2[value2] ...`
   * Values may contain spaces (e.g. `PS[0 0 27697 4 0 3678 132]`).
   *
   * @param telemetry - raw MM ID telemetry string
   * @returns map of key → value strings
   */
  parseAvalonTelemetry(telemetry) {
    const result = /* @__PURE__ */ new Map();
    const regex = /(\w+)\[([^\]]*)\]/g;
    let match;
    while ((match = regex.exec(telemetry)) !== null) {
      result.set(match[1], match[2]);
    }
    return result;
  }
  // public to allow unit tests
  /**
   * Parse a CGMiner "summary+version+stats" combined response into {@link MinerStats}.
   * Extracts power consumption from the Avalon-specific MM ID telemetry string.
   *
   * The `PS` field in MM ID telemetry has the format:
   * `PS[vin1 vin2 pin vout1 vout2 pout watt]`
   * where `watt` (index 6) is total power consumption in watts.
   *
   * @param response - raw combined API response
   * @returns parsed miner statistics including power
   */
  parseSummaryVersionStatsResponse(response) {
    var _a, _b;
    const baseStats = this.parseSummaryVersionResponse(response);
    const power = this.extractPowerFromStats((_b = (_a = response.stats) == null ? void 0 : _a[0]) == null ? void 0 : _b.STATS);
    return {
      ...baseStats,
      power,
      efficiency: power != null && baseStats.totalHashrate ? baseStats.totalHashrate / power : void 0
    };
  }
  /**
   * Extract power consumption (watts) from the first device entry in a stats response.
   *
   * Looks for the `PS` field in the first `MM ID<n>` telemetry string.
   * `PS[vin1 vin2 pin vout1 vout2 pout watt]` — `watt` (index 6) is total power consumption in watts.
   *
   * @param statsEntries - STATS array from a stats response
   * @returns power in watts, or undefined if not available
   */
  extractPowerFromStats(statsEntries) {
    if (!statsEntries) {
      return void 0;
    }
    const deviceEntry = statsEntries.find((entry) => "MM Count" in entry);
    if (!deviceEntry) {
      return void 0;
    }
    const mmIdKey = Object.keys(deviceEntry).find((key) => key.startsWith("MM ID"));
    if (!mmIdKey) {
      return void 0;
    }
    const telemetry = deviceEntry[mmIdKey];
    if (!telemetry) {
      return void 0;
    }
    const parsed = this.parseAvalonTelemetry(telemetry);
    const psValue = parsed.get("PS");
    if (!psValue) {
      return void 0;
    }
    const parts = psValue.trim().split(/\s+/);
    if (parts.length < 7) {
      return void 0;
    }
    const watts = (0, import_parse_utils.safeParseFloat)(parts[6]);
    return watts > 0 ? watts : void 0;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AvalonMiner
});
//# sourceMappingURL=AvalonMiner.js.map
