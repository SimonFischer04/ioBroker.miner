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
  delay: () => delay,
  setTimerBackend: () => setTimerBackend
});
module.exports = __toCommonJS(delay_exports);
var import_node_timers = require("node:timers");
var import_promises = require("node:timers/promises");
const nodeTimerBackend = {
  schedule: (callback, timeout) => (0, import_node_timers.setTimeout)(callback, timeout),
  clear: (timer) => (0, import_node_timers.clearTimeout)(timer),
  scheduleInterval: (callback, interval) => (0, import_node_timers.setInterval)(callback, interval),
  clearInterval: (timer) => (0, import_node_timers.clearInterval)(timer),
  delay: (timeout) => (0, import_promises.setTimeout)(timeout)
};
let timerBackend = nodeTimerBackend;
function setTimerBackend(backend) {
  timerBackend = backend;
}
async function delay(ms) {
  return timerBackend.delay(ms);
}
function asyncIntervalNoWait(asyncCallback, executeEveryMs) {
  const interval = timerBackend.scheduleInterval(() => {
    void (async () => {
      await asyncCallback();
    })();
  }, executeEveryMs);
  return {
    clear: () => {
      timerBackend.clearInterval(interval);
    }
  };
}
function asyncInterval(asyncCallback, msBetweenExecutions, shouldExecuteImmediately = false) {
  let timeout;
  const callbackWrapper = () => {
    void (async () => {
      await asyncCallback();
      timeout = timerBackend.schedule(callbackWrapper, msBetweenExecutions);
    })();
  };
  if (shouldExecuteImmediately) {
    void (async () => {
      await asyncCallback();
      timeout = timerBackend.schedule(callbackWrapper, msBetweenExecutions);
    })();
  } else {
    timeout = timerBackend.schedule(callbackWrapper, msBetweenExecutions);
  }
  return {
    clear: () => {
      timerBackend.clear(timeout);
    }
  };
}
function asyncTimeout(asyncCallback, ms) {
  const timeout = timerBackend.schedule(() => {
    void (async () => {
      await asyncCallback();
    })();
  }, ms);
  return {
    clear: () => {
      timerBackend.clear(timeout);
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  asyncInterval,
  asyncIntervalNoWait,
  asyncTimeout,
  delay,
  setTimerBackend
});
//# sourceMappingURL=delay.js.map
