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
var BosMode_exports = {};
__export(BosMode_exports, {
  BosMode: () => BosMode
});
module.exports = __toCommonJS(BosMode_exports);
const BosMode = {
  BOS_MODE_UNSPECIFIED: 0,
  BOS_MODE_UPGRADE: 1,
  BOS_MODE_RECOVERY: 2,
  BOS_MODE_SD: 3,
  BOS_MODE_NAND: 4,
  BOS_MODE_EMMC: 5
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BosMode
});
//# sourceMappingURL=BosMode.js.map
