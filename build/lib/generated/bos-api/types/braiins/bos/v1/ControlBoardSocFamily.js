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
var ControlBoardSocFamily_exports = {};
__export(ControlBoardSocFamily_exports, {
  ControlBoardSocFamily: () => ControlBoardSocFamily
});
module.exports = __toCommonJS(ControlBoardSocFamily_exports);
const ControlBoardSocFamily = {
  CONTROL_BOARD_SOC_FAMILY_UNSPECIFIED: 0,
  CONTROL_BOARD_SOC_FAMILY_CVITEK: 1,
  CONTROL_BOARD_SOC_FAMILY_BBB: 2,
  CONTROL_BOARD_SOC_FAMILY_AML: 3,
  CONTROL_BOARD_SOC_FAMILY_ZYNQ: 4,
  CONTROL_BOARD_SOC_FAMILY_BRAIINS: 5
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ControlBoardSocFamily
});
//# sourceMappingURL=ControlBoardSocFamily.js.map
