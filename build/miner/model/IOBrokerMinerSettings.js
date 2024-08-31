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
var IOBrokerMinerSettings_exports = {};
__export(IOBrokerMinerSettings_exports, {
  decryptDeviceSettings: () => decryptDeviceSettings,
  encryptDeviceSettings: () => encryptDeviceSettings,
  isMiner: () => isMiner
});
module.exports = __toCommonJS(IOBrokerMinerSettings_exports);
var import_Logger = require("../../lib/miner/model/Logger");
const logger = import_Logger.Logger.getLogger("IOBrokerMinerSettings");
function isMiner(settings) {
  return (settings == null ? void 0 : settings.category) === "miner";
}
function encryptDeviceSettings(settings, encryptFunction) {
  if (!isMiner(settings)) {
    logger.error(`category ${settings.category} is not yet supported.`);
    return settings;
  }
  switch (settings.settings.minerType) {
    case "teamRedMiner": {
      const trmSettings = settings.settings;
      trmSettings.claymore.password = encryptFunction(trmSettings.claymore.password);
      break;
    }
    case "claymoreMiner": {
      const claymoreSettings = settings.settings;
      claymoreSettings.password = encryptFunction(claymoreSettings.password);
      break;
    }
    case "xmRig": {
      const xmRigSettings = settings.settings;
      xmRigSettings.password = encryptFunction(xmRigSettings.password);
      break;
    }
    case "iceRiverOcMiner": {
      const iceRiverOcSettings = settings.settings;
      iceRiverOcSettings.password = encryptFunction(iceRiverOcSettings.password);
      break;
    }
    default: {
      break;
    }
  }
  return settings;
}
function decryptDeviceSettings(settings, decryptFunction) {
  if (!isMiner(settings)) {
    logger.error(`category ${settings.category} is not yet supported.`);
    return settings;
  }
  switch (settings.settings.minerType) {
    case "teamRedMiner": {
      const trmSettings = settings.settings;
      trmSettings.claymore.password = decryptFunction(trmSettings.claymore.password);
      break;
    }
    case "claymoreMiner": {
      const claymoreSettings = settings.settings;
      claymoreSettings.password = decryptFunction(claymoreSettings.password);
      break;
    }
    case "xmRig": {
      const xmRigSettings = settings.settings;
      xmRigSettings.password = decryptFunction(xmRigSettings.password);
      break;
    }
    case "iceRiverOcMiner": {
      const iceRiverOcSettings = settings.settings;
      iceRiverOcSettings.password = decryptFunction(iceRiverOcSettings.password);
      break;
    }
    default: {
      break;
    }
  }
  return settings;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decryptDeviceSettings,
  encryptDeviceSettings,
  isMiner
});
//# sourceMappingURL=IOBrokerMinerSettings.js.map
