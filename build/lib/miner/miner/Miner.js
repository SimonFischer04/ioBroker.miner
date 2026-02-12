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
var Miner_exports = {};
__export(Miner_exports, {
  Miner: () => Miner
});
module.exports = __toCommonJS(Miner_exports);
var crypto = __toESM(require("node:crypto"));
var import_Logger = require("../model/Logger");
class Miner {
  /**
   *
   */
  constructor(settings) {
    this.settings = settings;
    if (!settings.id) {
      this.settings.id = crypto.randomUUID();
    }
    this.logger = import_Logger.Logger.getLogger(this.getLoggerName());
  }
  logger;
  statSubscriptions = [];
  /**
   * Close / cleanup any open resources
   */
  close() {
    this.statSubscriptions = [];
    return Promise.resolve();
  }
  /**
   * Get name to use for the logger
   */
  getLoggerName() {
    return `Miner[${this.settings.id}, ${this.settings.minerType}]`;
  }
  /**
   * Subscribe to miner stats
   *
   * @param callback - callback that gets called when new stats are available
   */
  subscribeToStats(callback) {
    this.statSubscriptions.push(callback);
  }
  /**
   * Called by the miner when new stats are available.
   * Subscribers will be notified.
   *
   * @param stats - the new stats
   */
  async onStats(stats) {
    this.logger.debug(`publishing new stats to subscribers: ${JSON.stringify(stats)}`);
    for (const sub of this.statSubscriptions) {
      await sub(stats);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Miner
});
//# sourceMappingURL=Miner.js.map
