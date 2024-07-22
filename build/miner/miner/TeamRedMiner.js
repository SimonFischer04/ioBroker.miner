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
var TeamRedMiner_exports = {};
__export(TeamRedMiner_exports, {
  TeamRedMiner: () => TeamRedMiner
});
module.exports = __toCommonJS(TeamRedMiner_exports);
var import_PollingMiner = require("./PollingMiner");
class TeamRedMiner extends import_PollingMiner.PollingMiner {
  // TODO: actually does not support full claymore api
  // TODO: sgminer api
  connect() {
    throw new Error("Method not implemented.");
  }
  start() {
    throw new Error("Method not implemented.");
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
  TeamRedMiner
});
//# sourceMappingURL=TeamRedMiner.js.map
