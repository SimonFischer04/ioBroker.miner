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
var SaveAction_exports = {};
__export(SaveAction_exports, {
  SaveAction: () => SaveAction
});
module.exports = __toCommonJS(SaveAction_exports);
const SaveAction = {
  SAVE_ACTION_UNSPECIFIED: 0,
  SAVE_ACTION_SAVE: 1,
  SAVE_ACTION_SAVE_AND_APPLY: 2,
  SAVE_ACTION_SAVE_AND_FORCE_APPLY: 3
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SaveAction
});
//# sourceMappingURL=SaveAction.js.map
