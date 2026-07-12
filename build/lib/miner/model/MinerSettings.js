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
var MinerSettings_exports = {};
__export(MinerSettings_exports, {
  BOS_DEFAULT_PASSWORD: () => BOS_DEFAULT_PASSWORD,
  BOS_DEFAULT_USERNAME: () => BOS_DEFAULT_USERNAME,
  minerTypeKeys: () => minerTypeKeys
});
module.exports = __toCommonJS(MinerSettings_exports);
const minerTypeKeys = [
  "teamRedMiner",
  "claymoreMiner",
  "cgMiner",
  "xmRig",
  "iceRiverOcMiner",
  "bosMiner",
  "bos",
  "avalonMiner"
];
const BOS_DEFAULT_USERNAME = "root";
const BOS_DEFAULT_PASSWORD = "";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BOS_DEFAULT_PASSWORD,
  BOS_DEFAULT_USERNAME,
  minerTypeKeys
});
//# sourceMappingURL=MinerSettings.js.map
