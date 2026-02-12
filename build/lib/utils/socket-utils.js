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
      const cmd = `${JSON.stringify(data)}
`;
      logger.debug(`connected, sending cmd now ...: ${cmd}`);
      socket.write(cmd, (err) => {
        if (err) {
          logger.error(err.message);
          reject(new Error(err.message));
        } else {
          if (!expectResponse) {
            resolve(void 0);
          }
        }
      });
    });
    socket.on("timeout", () => {
      logger.warn("socket timeout");
      reject(new Error("socket timeout"));
    });
    socket.on("data", (data2) => {
      logger.debug(`received: ${data2.toString()}`);
      try {
        const jsonString = data2.toString().replace(/[^\x00-\x7F]/g, "").trim().replace(/[^}\]]*$/, "");
        const d = JSON.parse(jsonString);
        resolve(d);
      } catch (e) {
        const errMsg = `Failed to parse JSON: ${String(e)}`;
        logger.error(errMsg);
        reject(new Error(errMsg));
      }
    });
    socket.on("close", () => {
    });
    socket.on("error", (err) => {
      logger.error(err.message);
      reject(new Error(`socket error: ${err.message}`));
    });
    socket.setTimeout(3e3);
    socket.connect(port, host);
    setTimeout(() => {
      if (!handled) {
        const msg = `timeout handling socket command: ${JSON.stringify(data)}. maybe the password is wrong?`;
        logger.warn(msg);
        reject(new Error(msg));
      }
    }, 3e3);
  }).finally(() => {
    handled = true;
    socket.end();
    socket.destroy();
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendSocketCommand
});
//# sourceMappingURL=socket-utils.js.map
