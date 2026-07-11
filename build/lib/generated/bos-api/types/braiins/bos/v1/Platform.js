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
var Platform_exports = {};
__export(Platform_exports, {
  Platform: () => Platform
});
module.exports = __toCommonJS(Platform_exports);
const Platform = {
  PLATFORM_UNSPECIFIED: 0,
  PLATFORM_AM1_S9: 1,
  PLATFORM_AM2_S17: 2,
  PLATFORM_AM3_BBB: 3,
  PLATFORM_AM3_AML: 4,
  PLATFORM_STM32MP157C_II1_AM2: 5,
  PLATFORM_CVITEK_BM1_AM2: 6,
  PLATFORM_ZYNQ_BM3_AM2: 7,
  PLATFORM_STM32MP157C_II2_BMM1: 8
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Platform
});
//# sourceMappingURL=Platform.js.map
