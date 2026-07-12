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
var TunerState_exports = {};
__export(TunerState_exports, {
  TunerState: () => TunerState
});
module.exports = __toCommonJS(TunerState_exports);
const TunerState = {
  TUNER_STATE_UNSPECIFIED: 0,
  TUNER_STATE_DISABLED: 1,
  TUNER_STATE_STABLE: 2,
  TUNER_STATE_TUNING: 3,
  TUNER_STATE_ERROR: 4,
  TUNER_STATE_CONTINUOUS: 5,
  TUNER_STATE_PREHEAT: 6
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TunerState
});
//# sourceMappingURL=TunerState.js.map
