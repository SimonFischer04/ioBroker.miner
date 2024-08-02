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
var PollingMiner_exports = {};
__export(PollingMiner_exports, {
  PollingMiner: () => PollingMiner
});
module.exports = __toCommonJS(PollingMiner_exports);
var import_Miner = require("./Miner");
var import_Logger = require("../model/Logger");
var import_delay = require("../../utils/delay");
const logger = import_Logger.Logger.getLogger("PollingMiner");
class PollingMiner extends import_Miner.Miner {
  pollInterval;
  async init() {
    logger.info(`initializing with interval ${this.settings.pollInterval}`);
    if (!this.settings.pollInterval || this.settings.pollInterval < 100) {
      logger.error(`pollInterval >= 100 required. got: ${this.settings.pollInterval}`);
      return;
    }
    this.pollInterval = (0, import_delay.asyncInterval)(async () => {
      logger.debug("next poll interval time reached. calling fetchData()");
      await this.fetchData();
    }, this.settings.pollInterval, true);
  }
  async close() {
    var _a;
    (_a = this.pollInterval) == null ? void 0 : _a.clear();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PollingMiner
});
//# sourceMappingURL=PollingMiner.js.map
