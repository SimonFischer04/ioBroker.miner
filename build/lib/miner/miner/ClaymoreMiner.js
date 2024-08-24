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
var ClaymoreMiner_exports = {};
__export(ClaymoreMiner_exports, {
  ClaymoreMiner: () => ClaymoreMiner
});
module.exports = __toCommonJS(ClaymoreMiner_exports);
var import_PollingMiner = require("./PollingMiner");
var import_parse_utils = require("../../utils/parse-utils");
var import_MinerFeature = require("../model/MinerFeature");
var import_socket_utils = require("../../utils/socket-utils");
var ClaymoreCommandMethod = /* @__PURE__ */ ((ClaymoreCommandMethod2) => {
  ClaymoreCommandMethod2["minerGetStat1"] = "miner_getstat1";
  ClaymoreCommandMethod2["minerGetStat2"] = "miner_getstat2";
  ClaymoreCommandMethod2["minerGetFile"] = "miner_getfile";
  ClaymoreCommandMethod2["minerFile"] = "miner_file";
  ClaymoreCommandMethod2["minerRestart"] = "miner_restart";
  ClaymoreCommandMethod2["minerReboot"] = "miner_reboot";
  ClaymoreCommandMethod2["controlGpu"] = "control_gpu";
  return ClaymoreCommandMethod2;
})(ClaymoreCommandMethod || {});
class ClaymoreMiner extends import_PollingMiner.PollingMiner {
  async init() {
    await super.init();
    return Promise.resolve();
  }
  async start() {
    await this.sendCommand("control_gpu" /* controlGpu */, ["-1", "1"], false);
  }
  async fetchStats() {
    try {
      const response = await this.sendCommand("miner_getstat2" /* minerGetStat2 */, void 0, true);
      const parsedResponse = this.parseMinerGetStat2(response);
      this.logger.debug(`parsed response: ${JSON.stringify(parsedResponse)}`);
      return {
        raw: response,
        version: parsedResponse.minerVersion,
        totalHashrate: parsedResponse.ethTotal.hashrate * 1e3
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async stop() {
    await this.sendCommand("control_gpu" /* controlGpu */, ["-1", "0"], false);
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
    return `${super.getLoggerName()}ClaymoreMiner[${this.settings.host}:${this.settings.port}]`;
  }
  getCliArgs() {
    return [
      `--cm_api_listen=0.0.0.0:${this.settings.port}`,
      `--cm_api_password=${this.settings.password}`
    ];
  }
  async sendCommand(method, params, expectResponse = true) {
    return await (0, import_socket_utils.sendSocketCommand)(this.logger, this.settings.host, this.settings.port, {
      id: 0,
      jsonrpc: "2.0",
      psw: this.settings.password,
      method,
      params
    }, expectResponse);
  }
  // public to allow unit tests
  parseMinerGetStat1(response) {
    const [
      minerVersion,
      runningTime,
      ethTotalStats,
      ethDetailedHashrate,
      dcrTotalStats,
      dcrDetailedHashrate,
      temperatureAndFanSpeed,
      currentMiningPool,
      invalidSharesAndPoolSwitches
    ] = response.result;
    const [ethHashrate, ethShares, ethRejectedShares] = (ethTotalStats || "0;0;0").split(";").map(import_parse_utils.safeParseInt);
    const [dcrHashrate, dcrShares, dcrRejectedShares] = (dcrTotalStats || "0;0;0").split(";").map(import_parse_utils.safeParseInt);
    const [ethInvalidShares, ethPoolSwitches, dcrInvalidShares, dcrPoolSwitches] = (invalidSharesAndPoolSwitches || "0;0;0;0").split(";").map(import_parse_utils.safeParseInt);
    const gpuInfo = (temperatureAndFanSpeed || "").split(";").reduce((acc, value, index, array) => {
      if (index % 2 === 0) {
        const temperature = (0, import_parse_utils.safeParseInt)(value);
        const fanSpeed = (0, import_parse_utils.safeParseInt)(array[index + 1]);
        if (temperature !== 0 || fanSpeed !== 0) {
          acc.push({ temperature, fanSpeed });
        }
      }
      return acc;
    }, []);
    return {
      minerVersion: minerVersion || "",
      runningTimeMinutes: (0, import_parse_utils.safeParseInt)(runningTime),
      ethTotal: {
        hashrate: ethHashrate,
        shares: ethShares,
        rejectedShares: ethRejectedShares
      },
      ethDetailedHashrate: ethDetailedHashrate ? ethDetailedHashrate.split(";").map(import_parse_utils.safeParseInt) : [],
      dcrTotal: {
        hashrate: dcrHashrate,
        shares: dcrShares,
        rejectedShares: dcrRejectedShares
      },
      dcrDetailedHashrate: dcrDetailedHashrate ? dcrDetailedHashrate.split(";").filter((s) => s !== "") : [],
      gpuInfo,
      currentMiningPool: currentMiningPool || "",
      stats: {
        ethInvalidShares,
        ethPoolSwitches,
        dcrInvalidShares,
        dcrPoolSwitches
      }
    };
  }
  // public to allow unit tests
  parseMinerGetStat2(response) {
    const parsedStat1 = this.parseMinerGetStat1(response);
    const [
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ethAcceptedShares,
      ethRejectedShares,
      ethInvalidShares,
      dcrAcceptedShares,
      dcrRejectedShares,
      dcrInvalidShares,
      pciBusIndexes
    ] = response.result;
    const parseShares = (shares) => shares ? shares.split(";").map(import_parse_utils.safeParseInt) : [];
    return {
      ...parsedStat1,
      ethAcceptedShares: parseShares(ethAcceptedShares),
      ethRejectedShares: parseShares(ethRejectedShares),
      ethInvalidShares: parseShares(ethInvalidShares),
      dcrAcceptedShares: parseShares(dcrAcceptedShares),
      dcrRejectedShares: parseShares(dcrRejectedShares),
      dcrInvalidShares: parseShares(dcrInvalidShares),
      pciBusIndexes: parseShares(pciBusIndexes)
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ClaymoreMiner
});
//# sourceMappingURL=ClaymoreMiner.js.map
