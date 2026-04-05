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
var CGMinerApiTypes_exports = {};
__export(CGMinerApiTypes_exports, {
  CGMinerCommand: () => CGMinerCommand
});
module.exports = __toCommonJS(CGMinerApiTypes_exports);
var CGMinerCommand = /* @__PURE__ */ ((CGMinerCommand2) => {
  CGMinerCommand2["summary"] = "summary";
  CGMinerCommand2["coin"] = "coin";
  CGMinerCommand2["version"] = "version";
  CGMinerCommand2["config"] = "config";
  CGMinerCommand2["pools"] = "pools";
  CGMinerCommand2["devs"] = "devs";
  CGMinerCommand2["devDetails"] = "devdetails";
  CGMinerCommand2["stats"] = "stats";
  CGMinerCommand2["liteStats"] = "litestats";
  return CGMinerCommand2;
})(CGMinerCommand || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CGMinerCommand
});
//# sourceMappingURL=CGMinerApiTypes.js.map
