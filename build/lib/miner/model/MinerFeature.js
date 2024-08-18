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
var MinerFeature_exports = {};
__export(MinerFeature_exports, {
  MinerFeatureCategory: () => MinerFeatureCategory,
  MinerFeatureKey: () => MinerFeatureKey,
  getMinerFeatureFullId: () => getMinerFeatureFullId,
  minerFeatures: () => minerFeatures
});
module.exports = __toCommonJS(MinerFeature_exports);
var MinerFeatureKey = /* @__PURE__ */ ((MinerFeatureKey2) => {
  MinerFeatureKey2["running"] = "running";
  MinerFeatureKey2["rawStats"] = "rawStats";
  MinerFeatureKey2["version"] = "version";
  MinerFeatureKey2["totalHashrate"] = "totalHashrate";
  return MinerFeatureKey2;
})(MinerFeatureKey || {});
var MinerFeatureCategory = /* @__PURE__ */ ((MinerFeatureCategory2) => {
  MinerFeatureCategory2["control"] = "control";
  MinerFeatureCategory2["info"] = "info";
  return MinerFeatureCategory2;
})(MinerFeatureCategory || {});
const minerFeatures = {
  /*
     controls
  */
  ["running" /* running */]: {
    category: "control" /* control */,
    id: "MINER_RUNNING",
    label: "Running",
    description: "Whether the miner is running.",
    type: "boolean",
    readable: true,
    writable: true
  },
  /*
      info
   */
  ["rawStats" /* rawStats */]: {
    category: "info" /* info */,
    id: "RAW",
    label: "RAW Miner Stats",
    description: "Raw info returned by the miner.",
    type: "object",
    readable: true,
    writable: false,
    advanced: true
  },
  ["version" /* version */]: {
    category: "info" /* info */,
    id: "VERSION",
    label: "Miner Version",
    description: "The version of the miner software.",
    type: "string",
    readable: true,
    writable: false
  },
  ["totalHashrate" /* totalHashrate */]: {
    category: "info" /* info */,
    id: "TOTAL_HASHRATE",
    label: "Total Hashrate",
    description: "The total hashrate of the miner.",
    type: "number",
    unit: "kh/s",
    readable: true,
    writable: false
  }
};
function getMinerFeatureFullId(key) {
  return `${minerFeatures[key].category}.${minerFeatures[key].id}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MinerFeatureCategory,
  MinerFeatureKey,
  getMinerFeatureFullId,
  minerFeatures
});
//# sourceMappingURL=MinerFeature.js.map
