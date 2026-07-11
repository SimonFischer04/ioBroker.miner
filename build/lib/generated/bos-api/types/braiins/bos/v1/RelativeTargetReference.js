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
var RelativeTargetReference_exports = {};
__export(RelativeTargetReference_exports, {
  RelativeTargetReference: () => RelativeTargetReference
});
module.exports = __toCommonJS(RelativeTargetReference_exports);
const RelativeTargetReference = {
  RELATIVE_TARGET_REFERENCE_UNSPECIFIED: 0,
  RELATIVE_TARGET_REFERENCE_NOMINAL: 1,
  RELATIVE_TARGET_REFERENCE_MIN: 2,
  RELATIVE_TARGET_REFERENCE_MAX: 3,
  RELATIVE_TARGET_REFERENCE_CURRENT: 4
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RelativeTargetReference
});
//# sourceMappingURL=RelativeTargetReference.js.map
