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
  AvalonMinerCommand2["stats"] = "stats";
  AvalonMinerCommand2["litestats"] = "litestats";
  AvalonMinerCommand2["summary"] = "summary";
  AvalonMinerCommand2["pools"] = "pools";
  AvalonMinerCommand2["devs"] = "devs";
  AvalonMinerCommand2["coin"] = "coin";
  AvalonMinerCommand2["version"] = "version";
  AvalonMinerCommand2["config"] = "config";
  return AvalonMinerCommand2;
})(AvalonMinerCommand || {});
var AvalonControlCommand = /* @__PURE__ */ ((AvalonControlCommand2) => {
  AvalonControlCommand2["workmode_eco"] = "ascset|0,workmode,set,0";
  AvalonControlCommand2["workmode_standard"] = "ascset|0,workmode,set,1";
  AvalonControlCommand2["workmode_super"] = "ascset|0,workmode,set,2";
  AvalonControlCommand2["lcd_on"] = "ascset|0,lcd,0:1";
  AvalonControlCommand2["lcd_off"] = "ascset|0,lcd,0:0";
  AvalonControlCommand2["reboot"] = "ascset|0,reboot,0";
  return AvalonControlCommand2;
})(AvalonControlCommand || {});
class AvalonMiner extends import_PollingMiner.PollingMiner {
  async init() {
    await super.init();
    return Promise.resolve();
  }
  async start() {
    const timestamp = Math.floor(Date.now() / 1e3) + 5;
    await this.sendControlCommand(`ascset|0,softon,1:${timestamp}`);
  }
  async fetchStats() {
    try {
      const [summary, stats, pools] = await Promise.all([
        this.sendCommand("summary" /* summary */, "", true),
        this.sendCommand("stats" /* stats */, "", true),
        this.sendCommand("pools" /* pools */, "", true)
      ]);
      return {
        raw: {
          summary,
          stats,
          pools
        }
      };
    } catch (e) {
      return Promise.reject(e);
    }
  }
  async stop() {
    const timestamp = Math.floor(Date.now() / 1e3) + 5;
    await this.sendControlCommand(`ascset|0,softoff,1:${timestamp}`);
  }
  /**
   * Set workmode for the miner
   * @param mode - 'eco' (0), 'standard' (1), or 'super' (2)
   */
  async setWorkmode(mode) {
    const commandMap = {
      eco: "ascset|0,workmode,set,0" /* workmode_eco */,
      standard: "ascset|0,workmode,set,1" /* workmode_standard */,
      super: "ascset|0,workmode,set,2" /* workmode_super */
    };
    await this.sendControlCommand(commandMap[mode]);
  }
  /**
   * Control LCD display
   * @param on - true to turn on, false to turn off
   */
  async setLCD(on) {
    const command = on ? "ascset|0,lcd,0:1" /* lcd_on */ : "ascset|0,lcd,0:0" /* lcd_off */;
    await this.sendControlCommand(command);
  }
  /**
   * Reboot the miner
   */
  async reboot() {
    await this.sendControlCommand("ascset|0,reboot,0" /* reboot */);
  }
  getSupportedFeatures() {
    return [
      import_MinerFeature.MinerFeatureKey.running,
      import_MinerFeature.MinerFeatureKey.rawStats
    ];
  }
  getLoggerName() {
    return `${super.getLoggerName()}AvalonMiner[${this.settings.host}:${this.settings.port}]`;
  }
  getCliArgs() {
    return [];
  }
  async sendCommand(command, parameter = "", expectResponse = true) {
    return (0, import_socket_utils.sendSocketCommand)(this.logger, this.settings.host, this.settings.port, {
      command,
      parameter
    }, expectResponse);
  }
  async sendControlCommand(command) {
    return (0, import_socket_utils.sendRawSocketCommand)(this.logger, this.settings.host, this.settings.port, command, false);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AvalonMiner
});
//# sourceMappingURL=AvalonMiner.js.map
