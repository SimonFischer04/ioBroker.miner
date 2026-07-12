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
var MinerStatus_exports = {};
__export(MinerStatus_exports, {
  MinerStatus: () => MinerStatus
});
module.exports = __toCommonJS(MinerStatus_exports);
const MinerStatus = {
  MINER_STATUS_UNSPECIFIED: 0,
  MINER_STATUS_NOT_STARTED: 1,
  MINER_STATUS_NORMAL: 2,
  MINER_STATUS_PAUSED: 3,
  MINER_STATUS_SUSPENDED: 4,
  MINER_STATUS_RESTRICTED: 5
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MinerStatus
});
//# sourceMappingURL=MinerStatus.js.map
