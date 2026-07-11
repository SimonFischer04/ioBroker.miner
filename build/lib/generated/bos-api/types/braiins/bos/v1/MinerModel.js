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
var MinerModel_exports = {};
__export(MinerModel_exports, {
  MinerModel: () => MinerModel
});
module.exports = __toCommonJS(MinerModel_exports);
const MinerModel = {
  MINER_MODEL_UNSPECIFIED: 0,
  MINER_MODEL_ANTMINER_S9: 1,
  MINER_MODEL_ANTMINER_X17: 2,
  MINER_MODEL_ANTMINER_S17: 3,
  MINER_MODEL_ANTMINER_S17_PLUS: 4,
  MINER_MODEL_ANTMINER_S17_PRO: 5,
  MINER_MODEL_ANTMINER_S17E: 6,
  MINER_MODEL_ANTMINER_T17: 7,
  MINER_MODEL_ANTMINER_T17E: 8,
  MINER_MODEL_ANTMINER_T17_PLUS: 9,
  MINER_MODEL_ANTMINER_X19: 10,
  MINER_MODEL_ANTMINER_S19: 11,
  MINER_MODEL_ANTMINER_S19_PRO: 12,
  MINER_MODEL_ANTMINER_S19_PLUS: 13,
  MINER_MODEL_ANTMINER_S19J: 14,
  MINER_MODEL_ANTMINER_S19J_PRO: 15,
  MINER_MODEL_ANTMINER_S19A: 16,
  MINER_MODEL_ANTMINER_S19A_PRO: 17,
  MINER_MODEL_ANTMINER_S19XP: 18,
  MINER_MODEL_ANTMINER_T19: 19,
  MINER_MODEL_ANTMINER_S19J_PRO_PLUS: 20
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MinerModel
});
//# sourceMappingURL=MinerModel.js.map
