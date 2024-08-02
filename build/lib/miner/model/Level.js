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
var Level_exports = {};
__export(Level_exports, {
  Level: () => Level
});
module.exports = __toCommonJS(Level_exports);
var Level = /* @__PURE__ */ ((Level2) => {
  Level2[Level2["DEBUG"] = 0] = "DEBUG";
  Level2[Level2["INFO"] = 1] = "INFO";
  Level2[Level2["NOTICE"] = 2] = "NOTICE";
  Level2[Level2["WARN"] = 3] = "WARN";
  Level2[Level2["ERROR"] = 4] = "ERROR";
  Level2[Level2["FATAL"] = 5] = "FATAL";
  return Level2;
})(Level || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Level
});
//# sourceMappingURL=Level.js.map
