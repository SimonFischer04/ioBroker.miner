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
var Logger_exports = {};
__export(Logger_exports, {
  Logger: () => Logger,
  consoleLogger: () => consoleLogger
});
module.exports = __toCommonJS(Logger_exports);
var import_Level = require("./Level");
function consoleLogger() {
  return {
    log: (level, message) => {
      switch (level) {
        case import_Level.Level.DEBUG:
          console.debug(message);
          break;
        case import_Level.Level.INFO:
          console.info(message);
          break;
        case import_Level.Level.NOTICE:
          console.info(message);
          break;
        case import_Level.Level.WARN:
          console.warn(message);
          break;
        case import_Level.Level.ERROR:
          console.error(message);
          break;
        case import_Level.Level.FATAL:
          console.error(message);
          break;
      }
    }
  };
}
class Logger {
  constructor(name) {
    this.name = name;
  }
  static logger = consoleLogger();
  /**
   *
   */
  static getLogger(name) {
    return new Logger(name);
  }
  /**
   *
   */
  static setLogger(logger) {
    Logger.logger = logger;
  }
  /**
   *
   */
  log(message) {
    this.logWithLevel(import_Level.Level.INFO, message);
  }
  /**
   *
   */
  debug(message) {
    this.logWithLevel(import_Level.Level.DEBUG, message);
  }
  /**
   *
   */
  info(message) {
    this.logWithLevel(import_Level.Level.INFO, message);
  }
  /**
   *
   */
  notice(message) {
    this.logWithLevel(import_Level.Level.NOTICE, message);
  }
  /**
   *
   */
  warn(message) {
    this.logWithLevel(import_Level.Level.WARN, message);
  }
  /**
   *
   */
  error(message) {
    this.logWithLevel(import_Level.Level.ERROR, message);
  }
  /**
   *
   */
  fatal(message) {
    this.logWithLevel(import_Level.Level.FATAL, message);
  }
  logWithLevel(level, message) {
    Logger.logger.log(level, `[${this.name}] ${import_Level.Level[level]}: ${message}`);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Logger,
  consoleLogger
});
//# sourceMappingURL=Logger.js.map
