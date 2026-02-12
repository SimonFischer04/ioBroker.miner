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
var http_utils_exports = {};
__export(http_utils_exports, {
  sendGenericHTTPRequest: () => sendGenericHTTPRequest
});
module.exports = __toCommonJS(http_utils_exports);
async function sendGenericHTTPRequest(protocol, host, port, password, logger, endpoint, httpMethod, body) {
  try {
    const response = await fetch(`${protocol}://${host}:${port}/${endpoint}`, {
      method: httpMethod,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`
      },
      body: body ? JSON.stringify(body) : null
    });
    if (response.status !== 200) {
      const error = `Error sending JSON-RPC command: ${response.statusText}`;
      logger.error(error);
      return Promise.reject(error);
    }
    return await response.json();
  } catch (e) {
    logger.error(`Error sending HTTP request: ${e}`);
    return Promise.reject(e);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sendGenericHTTPRequest
});
//# sourceMappingURL=http-utils.js.map
