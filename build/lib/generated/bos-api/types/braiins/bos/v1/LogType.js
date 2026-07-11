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
var LogType_exports = {};
__export(LogType_exports, {
  LogType: () => LogType
});
module.exports = __toCommonJS(LogType_exports);
const LogType = {
  LOG_TYPE_UNSPECIFIED: 0,
  LOG_TYPE_ERRORS: 1,
  LOG_TYPE_BOSMINER: 2,
  LOG_TYPE_BOSER: 3,
  LOG_TYPE_MONITOR: 4,
  LOG_TYPE_SYSLOG: 5,
  LOG_TYPE_DMESG: 6
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LogType
});
//# sourceMappingURL=LogType.js.map
