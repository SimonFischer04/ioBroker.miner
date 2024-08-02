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
var import_Logger = require("../model/Logger");
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
  logger;
  constructor(settings) {
    super(settings);
    this.logger = import_Logger.Logger.getLogger(`ClaymoreMiner[${settings.host}:${settings.port}]`);
  }
  async init() {
    await super.init();
    return Promise.resolve();
  }
  start() {
    return this.sendCommand("control_gpu" /* controlGpu */, ["-1", "1"]);
  }
  async fetchData() {
    await this.sendCommand("miner_getstat2" /* minerGetStat2 */);
  }
  async stop() {
    await this.sendCommand("control_gpu" /* controlGpu */, ["-1", "0"]);
  }
  async sendCommand(method, params) {
    this.logger.debug(`sendCommand: ${method} ${params}`);
    return new Promise((resolve, reject) => {
      const socket = new import_node_net.Socket();
      socket.on("connect", () => {
        const cmd = JSON.stringify({
          id: 0,
          jsonrpc: "2.0",
          method,
          params
        }) + "\n";
        this.logger.debug(`connected, sending cmd now ...: ${cmd}`);
        socket.write(cmd);
        socket.setTimeout(1e3);
      });
      socket.on("timeout", () => {
        socket.end();
        socket.destroy();
        this.logger.warn("socket timeout");
        reject();
      });
      socket.on("data", (data) => {
        const d = JSON.parse(data.toString());
        this.logger.debug(`received: ${data.toString()}`);
        resolve(d);
      });
      socket.on("close", () => {
      });
      socket.on("error", (err) => {
        reject(`socket error: ${err.message}`);
        this.logger.error(err.message);
        socket.destroy();
        resolve();
      });
      socket.connect(this.settings.port, this.settings.host);
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ClaymoreMiner
});
//# sourceMappingURL=ClaymoreMiner.js.map
