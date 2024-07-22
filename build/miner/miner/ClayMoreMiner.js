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
var ClayMoreMiner_exports = {};
__export(ClayMoreMiner_exports, {
  ClayMoreMiner: () => ClayMoreMiner
});
module.exports = __toCommonJS(ClayMoreMiner_exports);
var import_node_net = require("node:net");
var import_PollingMiner = require("./PollingMiner");
class ClayMoreMiner extends import_PollingMiner.PollingMiner {
  client = new import_node_net.Socket();
  connect() {
    if (!this.client.pending) {
      console.warn("ClayMoreMiner/connect: called with already open socket");
    }
    this.client.connect(this.settings.port, this.settings.host, () => {
      console.log("Connected to server");
    });
    return Promise.resolve();
  }
  start() {
    this.client.write(JSON.stringify({
      id: 0,
      jsonrpc: "2.0",
      method: "control_gpu",
      params: ["-1", "0"]
      // params: ["-1", "2"]
    }) + "\n");
    return Promise.resolve();
  }
  fetchData() {
    throw new Error("Method not implemented.");
  }
  stop() {
    throw new Error("Method not implemented.");
  }
  close() {
    throw new Error("Method not implemented.");
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ClayMoreMiner
});
//# sourceMappingURL=ClayMoreMiner.js.map
