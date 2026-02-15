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
var MinerFactory_exports = {};
__export(MinerFactory_exports, {
  createMiner: () => createMiner
});
module.exports = __toCommonJS(MinerFactory_exports);
var import_TeamRedMiner = require("./TeamRedMiner");
var import_ClaymoreMiner = require("./ClaymoreMiner");
var import_SGMiner = require("./SGMiner");
var import_XMRigMiner = require("./XMRigMiner");
var import_IceRiverOcMiner = require("./IceRiverOcMiner");
var import_BOSMiner = require("./BOSMiner");
var import_AvalonMiner = require("./AvalonMiner");
function createMiner(settings) {
  switch (settings.minerType) {
    case "teamRedMiner": {
      return new import_TeamRedMiner.TeamRedMiner(settings);
    }
    case "claymoreMiner": {
      return new import_ClaymoreMiner.ClaymoreMiner(settings);
    }
    case "sgMiner": {
      return new import_SGMiner.SGMiner(settings);
    }
    case "xmRig": {
      return new import_XMRigMiner.XMRigMiner(settings);
    }
    case "iceRiverOcMiner": {
      return new import_IceRiverOcMiner.IceRiverOcMiner(settings);
    }
    case "bosMiner": {
      return new import_BOSMiner.BOSMiner(settings);
    }
    case "avalonMiner": {
      return new import_AvalonMiner.AvalonMiner(settings);
    }
    default: {
      throw new Error(`createMiner minerType: ${settings.minerType} not supported yet`);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createMiner
});
//# sourceMappingURL=MinerFactory.js.map
