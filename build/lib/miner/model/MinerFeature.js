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
  MinerFeatureKey2["reboot"] = "reboot";
  MinerFeatureKey2["version"] = "version";
  MinerFeatureKey2["stats"] = "stats";
  MinerFeatureKey2["rawStats"] = "rawStats";
  return MinerFeatureKey2;
})(MinerFeatureKey || {});
var MinerFeatureCategory = /* @__PURE__ */ ((MinerFeatureCategory2) => {
  MinerFeatureCategory2["control"] = "control";
  MinerFeatureCategory2["info"] = "info";
  MinerFeatureCategory2["stats"] = "stats";
  MinerFeatureCategory2["raw"] = "raw";
  return MinerFeatureCategory2;
})(MinerFeatureCategory || {});
const minerFeatures = {
  /*
     control
  */
  ["running" /* running */]: {
    category: "control" /* control */,
    id: "running",
    label: "Running",
    description: "Whether the miner is running.",
    type: "boolean",
    role: "switch",
    readable: true,
    writable: true
  },
  ["reboot" /* reboot */]: {
    category: "control" /* control */,
    id: "reboot",
    label: "Reboot",
    description: "Trigger a device reboot.",
    type: "boolean",
    role: "button",
    readable: false,
    writable: true
  },
  /*
      info – identity / config / firmware / connection meta
   */
  ["version" /* version */]: {
    category: "info" /* info */,
    id: "version",
    label: "Miner Version",
    description: "The version of the miner software.",
    type: "string",
    readable: true,
    writable: false
  },
  /*
      stats – live performance metrics.
      When a miner declares this feature it will get all stats sub-states
      (totalHashrate, power, efficiency, acceptedShares, rejectedShares).
      The miner fills whatever values it can in MinerStats.
   */
  ["stats" /* stats */]: {
    category: "stats" /* stats */,
    id: "stats",
    label: "Statistics",
    description: "Live performance metrics are available.",
    type: "mixed",
    readable: true,
    writable: false
  },
  /*
      raw – raw API payloads (expert)
   */
  ["rawStats" /* rawStats */]: {
    category: "raw" /* raw */,
    id: "stats",
    label: "RAW Miner Stats",
    description: "Raw info returned by the miner.",
    type: "object",
    readable: true,
    writable: false,
    advanced: true
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
