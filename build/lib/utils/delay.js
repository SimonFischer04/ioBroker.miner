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
var delay_exports = {};
__export(delay_exports, {
  asyncInterval: () => asyncInterval,
  asyncIntervalNoWait: () => asyncIntervalNoWait,
  asyncTimeout: () => asyncTimeout,
  delay: () => delay
});
module.exports = __toCommonJS(delay_exports);
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function asyncIntervalNoWait(asyncCallback, executeEveryMs) {
  return setInterval(() => {
    void (async () => {
      await asyncCallback();
    })();
  }, executeEveryMs);
}
function asyncInterval(asyncCallback, msBetweenExecutions, shouldExecuteImmediately = false) {
  let timeout;
  const callbackWrapper = () => {
    void (async () => {
      await asyncCallback();
      timeout = setTimeout(callbackWrapper, msBetweenExecutions);
    })();
  };
  if (shouldExecuteImmediately) {
    void (async () => {
      await asyncCallback();
      timeout = setTimeout(callbackWrapper, msBetweenExecutions);
    })();
  } else {
    timeout = setTimeout(callbackWrapper, msBetweenExecutions);
  }
  return {
    clear: () => {
      clearTimeout(timeout);
    }
  };
}
function asyncTimeout(asyncCallback, ms) {
  return setTimeout(() => {
    void (async () => {
      await asyncCallback();
    })();
  }, ms);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  asyncInterval,
  asyncIntervalNoWait,
  asyncTimeout,
  delay
});
//# sourceMappingURL=delay.js.map
