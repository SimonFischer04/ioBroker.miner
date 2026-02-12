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
var socket_utils_exports = {};
__export(socket_utils_exports, {
  sendRawSocketCommand: () => sendRawSocketCommand,
  sendSocketCommand: () => sendSocketCommand
});
module.exports = __toCommonJS(socket_utils_exports);
var import_node_net = require("node:net");
async function sendSocketCommand(logger, host, port, data, expectResponse = true) {
  logger.debug(`sendCommand: ${JSON.stringify(data)}`);
  let handled = false;
  const socket = new import_node_net.Socket();
  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      const cmd = JSON.stringify(data) + "\n";
      logger.debug(`connected, sending cmd now ...: ${cmd}`);
      socket.write(cmd, (err) => {
        if (err) {
          logger.error(err.message);
          reject(err.message);
        } else {
          if (!expectResponse) {
            resolve(void 0);
          }
        }
      });
    });
    socket.on("timeout", () => {
      logger.warn("socket timeout");
      reject("socket timeout");
    });
    socket.on("data", (data2) => {
      logger.debug(`received: ${data2.toString()}`);
      try {
        const jsonString = data2.toString().replace(/[^\x00-\x7F]/g, "").trim().replace(/[^}\]]*$/, "");
        const d = JSON.parse(jsonString);
        resolve(d);
      } catch (e) {
        const errMsg = `Failed to parse JSON: ${e}`;
        logger.error(errMsg);
        reject(errMsg);
      }
    });
    socket.on("close", () => {
    });
    socket.on("error", (err) => {
      logger.error(err.message);
      reject(`socket error: ${err.message}`);
    });
    socket.setTimeout(3e3);
    socket.connect(port, host);
    setTimeout(() => {
      if (!handled) {
        const msg = `timeout handling socket command: ${JSON.stringify(data)}. maybe the password is wrong?`;
        logger.warn(msg);
        reject(msg);
      }
    }, 3e3);
  }).finally(() => {
    handled = true;
    socket.end();
    socket.destroy();
  });
}
async function sendRawSocketCommand(logger, host, port, command, expectResponse = false) {
  logger.debug(`sendRawCommand: ${command}`);
  let handled = false;
  const socket = new import_node_net.Socket();
  return new Promise((resolve, reject) => {
    socket.on("connect", () => {
      const cmd = command + "\n";
      logger.debug(`connected, sending raw cmd now ...: ${cmd}`);
      socket.write(cmd, (err) => {
        if (err) {
          logger.error(err.message);
          handled = true;
          reject(`Failed to write command "${command}": ${err.message}`);
        } else {
          if (!expectResponse) {
            handled = true;
            resolve(void 0);
          }
        }
      });
    });
    socket.on("timeout", () => {
      logger.warn(`socket timeout for command: ${command}`);
      handled = true;
      reject(`socket timeout for command: ${command}`);
    });
    socket.on("data", (data) => {
      logger.debug(`received: ${data.toString()}`);
      try {
        const jsonString = data.toString().replace(/[^\x00-\x7F]/g, "").trim().replace(/[^}\]]*$/, "");
        const d = JSON.parse(jsonString);
        handled = true;
        resolve(d);
      } catch (e) {
        const errMsg = `Failed to parse JSON: ${e}`;
        logger.error(errMsg);
        handled = true;
        reject(errMsg);
      }
    });
    socket.on("close", () => {
    });
    socket.on("error", (err) => {
      logger.error(err.message);
      handled = true;
      reject(`socket error: ${err.message}`);
    });
    socket.setTimeout(3e3);
    socket.connect(port, host);
    setTimeout(() => {
      if (!handled) {
        const msg = `timeout handling raw socket command: ${command}`;
        logger.warn(msg);
        handled = true;
        reject(msg);
      }
    }, 3e3);
  }).finally(() => {
    socket.end();
    socket.destroy();
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendRawSocketCommand,
  sendSocketCommand
});
//# sourceMappingURL=socket-utils.js.map
