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
var DayOfWeek_exports = {};
__export(DayOfWeek_exports, {
  DayOfWeek: () => DayOfWeek
});
module.exports = __toCommonJS(DayOfWeek_exports);
const DayOfWeek = {
  DAY_OF_WEEK_UNSPECIFIED: 0,
  DAY_OF_WEEK_MONDAY: 1,
  DAY_OF_WEEK_TUESDAY: 2,
  DAY_OF_WEEK_WEDNESDAY: 3,
  DAY_OF_WEEK_THURSDAY: 4,
  DAY_OF_WEEK_FRIDAY: 5,
  DAY_OF_WEEK_SATURDAY: 6,
  DAY_OF_WEEK_SUNDAY: 7
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DayOfWeek
});
//# sourceMappingURL=DayOfWeek.js.map
