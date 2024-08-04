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
var import_node_net = require("node:net");
var import_PollingMiner = require("./PollingMiner");
var import_parse_utils = require("../../utils/parse-utils");
var import_MinerFeature = require("../model/MinerFeature");
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
  constructor(settings) {
    super(settings);
  }
  async init() {
    await super.init();
    return Promise.resolve();
  }
  start() {
    return this.sendCommand("control_gpu" /* controlGpu */, ["-1", "1"], false);
  }
  async fetchStats() {
    try {
      const response = await this.sendCommand("miner_getstat2" /* minerGetStat2 */, void 0, true);
      const parsedResponse = this.parseMinerGetStat2(response);
      this.logger.debug(`parsed response: ${JSON.stringify(parsedResponse)}`);
      return {
        version: parsedResponse.minerVersion,
        totalHashrate: parsedResponse.ethTotal.hashrate
        // actually "ETH hashrate" also means other hashing algorithms
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
      import_MinerFeature.MinerFeatureKey.version,
      import_MinerFeature.MinerFeatureKey.totalHashrate
    ];
  }
  getLoggerName() {
    return `${super.getLoggerName()}ClaymoreMiner[${this.settings.host}:${this.settings.port}]`;
  }
  async sendCommand(method, params, expectResponse = true) {
    this.logger.debug(`sendCommand: ${method} ${params}`);
    let handled = false;
    const socket = new import_node_net.Socket();
    return new Promise((resolve, reject) => {
      socket.on("connect", () => {
        const cmd = JSON.stringify({
          id: 0,
          jsonrpc: "2.0",
          psw: this.settings.password,
          method,
          params
        }) + "\n";
        this.logger.debug(`connected, sending cmd now ...: ${cmd}`);
        socket.write(cmd, (err) => {
          if (err) {
            this.logger.error(err.message);
            reject(err.message);
          } else {
            if (!expectResponse) {
              resolve(void 0);
            }
          }
        });
      });
      socket.on("timeout", () => {
        this.logger.warn("socket timeout");
        reject("socket timeout");
      });
      socket.on("data", (data) => {
        const d = JSON.parse(data.toString());
        this.logger.debug(`received: ${data.toString()}`);
        resolve(d);
      });
      socket.on("close", () => {
      });
      socket.on("error", (err) => {
        this.logger.error(err.message);
        reject(`socket error: ${err.message}`);
      });
      socket.setTimeout(3e3);
      socket.connect(this.settings.port, this.settings.host);
      setTimeout(() => {
        if (!handled) {
          const msg = `timeout handling socket command: ${method} ${params}. maybe the password is wrong?`;
          this.logger.warn(msg);
          reject(msg);
        }
      }, 3e3);
    }).finally(() => {
      handled = true;
      socket.end();
      socket.destroy();
    });
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
