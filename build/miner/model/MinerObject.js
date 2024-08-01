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
var MinerObject_exports = {};
__export(MinerObject_exports, {
  MinerObject: () => MinerObject
});
module.exports = __toCommonJS(MinerObject_exports);
var MinerObject = /* @__PURE__ */ ((MinerObject2) => {
  MinerObject2["controls"] = "control";
  MinerObject2["info"] = "info";
  MinerObject2["running"] = `control.running`;
  return MinerObject2;
})(MinerObject || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MinerObject
});
//# sourceMappingURL=MinerObject.js.map
