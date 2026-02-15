"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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
  AvalonMinerCommand2["stats"] = "stats";
  AvalonMinerCommand2["summary"] = "summary";
  AvalonMinerCommand2["coin"] = "coin";
  AvalonMinerCommand2["pools"] = "pools";
  AvalonMinerCommand2["devs"] = "devs";
  return AvalonMinerCommand2;
})(AvalonMinerCommand || {});
var AvalonMinerControlCommand = /* @__PURE__ */ ((AvalonMinerControlCommand2) => {
  AvalonMinerControlCommand2["workmode_eco"] = "ascset|0,workmode,set,0";
  AvalonMinerControlCommand2["workmode_standard"] = "ascset|0,workmode,set,1";
  AvalonMinerControlCommand2["workmode_super"] = "ascset|0,workmode,set,2";
  AvalonMinerControlCommand2["softon"] = "ascset|0,softon,1:";
  AvalonMinerControlCommand2["softoff"] = "ascset|0,softoff,1:";
  AvalonMinerControlCommand2["lcd_on"] = "ascset|0,lcd,0:1";
  AvalonMinerControlCommand2["lcd_off"] = "ascset|0,lcd,0:0";
  return AvalonMinerControlCommand2;
})(AvalonMinerControlCommand || {});
class AvalonMiner extends import_PollingMiner.PollingMiner {
  /**
   * Start/resume the miner from standby
   */
  async start() {
    const timestamp = Math.floor(Date.now() / 1e3) + 5;
    await this.sendControlCommand(`${"ascset|0,softon,1:" /* softon */}${timestamp}`, false);
  }
  /**
   * Fetch stats from the miner
   */
  async fetchStats() {
    try {
      const [summary, stats, coin, pools, devs] = await Promise.all([
        this.sendCommand("summary" /* summary */, "", true).catch(() => null),
        this.sendCommand("stats" /* stats */, "", true).catch(() => null),
        this.sendCommand("coin" /* coin */, "", true).catch(() => null),
        this.sendCommand("pools" /* pools */, "", true).catch(() => null),
        this.sendCommand("devs" /* devs */, "", true).catch(() => null)
      ]);
      return {
        raw: {
          summary,
          stats,
          coin,
          pools,
          devs
        }
      };
    } catch (e) {
      return Promise.reject(e instanceof Error ? e : new Error(String(e)));
    }
  }
  /**
   * Stop/pause the miner (send to standby)
   */
  async stop() {
    const timestamp = Math.floor(Date.now() / 1e3) + 5;
    await this.sendControlCommand(`${"ascset|0,softoff,1:" /* softoff */}${timestamp}`, false);
  }
  /**
   * Get supported features for Avalon miners
   */
  getSupportedFeatures() {
    return [import_MinerFeature.MinerFeatureKey.running, import_MinerFeature.MinerFeatureKey.rawStats];
  }
  /**
   * Get logger name for this miner
   */
  getLoggerName() {
    return `${super.getLoggerName()}AvalonMiner[${this.settings.host}:${this.settings.port}]`;
  }
  /**
   * Get CLI arguments (not applicable for Avalon as it's a standalone device)
   */
  getCliArgs() {
    return [];
  }
  /**
   * Send a CGMiner-style command
   * @param command - The command to send
   * @param parameter - Optional parameter for the command
   * @param expectResponse - Whether to expect a response
   */
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
  /**
   * Send an Avalon-specific control command (ascset)
   * @param command - The control command to send
   * @param expectResponse - Whether to expect a response
   */
  async sendControlCommand(command, expectResponse = false) {
    const { Socket } = await Promise.resolve().then(() => __toESM(require("node:net")));
    const socket = new Socket();
    return new Promise((resolve, reject) => {
      socket.on("connect", () => {
        this.logger.debug(`sending control command: ${command}`);
        socket.write(`${command}
`, (err) => {
          if (err) {
            this.logger.error(err.message);
            reject(new Error(err.message));
          } else {
            if (!expectResponse) {
              resolve();
            }
          }
        });
      });
      socket.on("timeout", () => {
        this.logger.warn("socket timeout");
        reject(new Error("socket timeout"));
      });
      socket.on("error", (err) => {
        this.logger.error(err.message);
        reject(new Error(`socket error: ${err.message}`));
      });
      socket.setTimeout(3e3);
      socket.connect(this.settings.port, this.settings.host);
      setTimeout(() => {
        socket.end();
        socket.destroy();
      }, 1e3);
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AvalonMiner
});
//# sourceMappingURL=AvalonMiner.js.map
