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
var CoolingMode_exports = {};
__export(CoolingMode_exports, {
  CoolingMode: () => CoolingMode
});
module.exports = __toCommonJS(CoolingMode_exports);
const CoolingMode = {
  COOLING_MODE_UNSPECIFIED: 0,
  COOLING_MODE_AUTO: 1,
  COOLING_MODE_MANUAL: 2,
  COOLING_MODE_DISABLED: 3,
  COOLING_MODE_IMMERSION: 4,
  COOLING_MODE_HYDRO: 5
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CoolingMode
});
//# sourceMappingURL=CoolingMode.js.map
