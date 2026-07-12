"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var BosApiClient_exports = {};
__export(BosApiClient_exports, {
  BosApiClient: () => BosApiClient
});
module.exports = __toCommonJS(BosApiClient_exports);
var grpc = __toESM(require("@grpc/grpc-js"));
var protoLoader = __toESM(require("@grpc/proto-loader"));
var import_node_path = __toESM(require("node:path"));
const PROTO_ROOT = import_node_path.default.join(__dirname, "../../generated/bos-api/proto");
const PROTO_FILES = [
  import_node_path.default.join(PROTO_ROOT, "bos/version.proto"),
  import_node_path.default.join(PROTO_ROOT, "bos/v1/actions.proto"),
  import_node_path.default.join(PROTO_ROOT, "bos/v1/authentication.proto"),
  import_node_path.default.join(PROTO_ROOT, "bos/v1/miner.proto"),
  import_node_path.default.join(PROTO_ROOT, "bos/v1/performance.proto")
];
function loadBosPackage() {
  const packageDefinition = protoLoader.loadSync(PROTO_FILES, {
    includeDirs: [PROTO_ROOT],
    longs: Number,
    enums: Number,
    defaults: false,
    oneofs: true
  });
  return grpc.loadPackageDefinition(packageDefinition);
}
function unary(method, request, timeoutMs, metadata = new grpc.Metadata()) {
  return unaryWithMetadata(method, request, timeoutMs, metadata).then((result) => result.response);
}
function unaryWithMetadata(method, request, timeoutMs, metadata = new grpc.Metadata()) {
  const options = timeoutMs ? { deadline: new Date(Date.now() + timeoutMs) } : {};
  return new Promise((resolve, reject) => {
    let responseMetadata = new grpc.Metadata();
    const call = method(request, metadata, options, (error, response) => {
      if (error) {
        reject(error);
        return;
      }
      if (!response) {
        reject(new Error("BOS API returned an empty response"));
        return;
      }
      resolve({ response, metadata: responseMetadata });
    });
    call.on("metadata", (metadata2) => {
      responseMetadata = metadata2;
    });
  });
}
class BosApiClient {
  minerService;
  actionsService;
  authenticationService;
  performanceService;
  apiVersionService;
  timeoutMs;
  username;
  password;
  token;
  tokenRefreshDeadline = 0;
  tokenTimeoutMs = 36e5;
  /**
   *
   * @param options Connection and authentication options for the Braiins OS API client.
   */
  constructor(options) {
    const credentials = options.secure ? grpc.credentials.createSsl() : grpc.credentials.createInsecure();
    const target = `${options.host}:${options.port}`;
    const bosPackage = loadBosPackage();
    this.timeoutMs = options.timeoutMs;
    this.username = options.username;
    this.password = options.password;
    this.minerService = new bosPackage.braiins.bos.v1.MinerService(target, credentials);
    this.actionsService = new bosPackage.braiins.bos.v1.ActionsService(target, credentials);
    this.authenticationService = new bosPackage.braiins.bos.v1.AuthenticationService(target, credentials);
    this.performanceService = new bosPackage.braiins.bos.v1.PerformanceService(target, credentials);
    this.apiVersionService = new bosPackage.braiins.bos.ApiVersionService(target, credentials);
  }
  /**
   *
   */
  async login() {
    var _a;
    if (this.username === void 0 || this.password === void 0) {
      throw new Error("BOS API username and password are required for authentication");
    }
    const { response, metadata } = await unaryWithMetadata(
      this.authenticationService.login.bind(this.authenticationService),
      { username: this.username, password: this.password },
      this.timeoutMs
    );
    const token = getStringMetadataValue(metadata, "authorization");
    if (!token) {
      throw new Error("BOS API login returned no authorization token");
    }
    this.token = token;
    this.tokenTimeoutMs = Math.max(((_a = response.timeoutS) != null ? _a : 3600) - 5, 1) * 1e3;
    this.refreshTokenDeadline();
    return response;
  }
  /**
   *
   */
  getMinerDetails() {
    return this.authenticatedUnary(
      "MinerService.GetMinerDetails",
      this.minerService.getMinerDetails.bind(this.minerService),
      {}
    );
  }
  /**
   *
   */
  getMinerStats() {
    return this.authenticatedUnary(
      "MinerService.GetMinerStats",
      this.minerService.getMinerStats.bind(this.minerService),
      {}
    );
  }
  /**
   *
   */
  getApiVersion() {
    return this.authenticatedUnary(
      "ApiVersionService.GetApiVersion",
      this.apiVersionService.getApiVersion.bind(this.apiVersionService),
      {}
    );
  }
  /**
   *
   */
  getTunerState() {
    return this.authenticatedUnary(
      "PerformanceService.GetTunerState",
      this.performanceService.getTunerState.bind(this.performanceService),
      {}
    );
  }
  /**
   *
   * @param watt Target power value in watts to send to the Braiins OS API.
   */
  setPowerTarget(watt) {
    return this.authenticatedUnary(
      "PerformanceService.SetPowerTarget",
      this.performanceService.setPowerTarget.bind(this.performanceService),
      {
        saveAction: 2,
        powerTarget: { watt }
      }
    );
  }
  /**
   *
   */
  start() {
    return this.authenticatedUnary("ActionsService.Start", this.actionsService.start.bind(this.actionsService), {});
  }
  /**
   *
   */
  stop() {
    return this.authenticatedUnary("ActionsService.Stop", this.actionsService.stop.bind(this.actionsService), {});
  }
  /**
   *
   */
  pauseMining() {
    return this.authenticatedUnary(
      "ActionsService.PauseMining",
      this.actionsService.pauseMining.bind(this.actionsService),
      {}
    );
  }
  /**
   *
   */
  resumeMining() {
    return this.authenticatedUnary(
      "ActionsService.ResumeMining",
      this.actionsService.resumeMining.bind(this.actionsService),
      {}
    );
  }
  /**
   *
   */
  reboot() {
    return this.authenticatedUnary(
      "ActionsService.Reboot",
      this.actionsService.reboot.bind(this.actionsService),
      {}
    );
  }
  /**
   *
   */
  close() {
    this.minerService.close();
    this.actionsService.close();
    this.authenticationService.close();
    this.performanceService.close();
    this.apiVersionService.close();
  }
  async authenticatedUnary(methodName, method, request) {
    await this.ensureAuthenticated();
    if (!this.token) {
      return unary(method, request, this.timeoutMs);
    }
    try {
      const response = await unary(method, request, this.timeoutMs, this.createAuthMetadata());
      this.refreshTokenDeadline();
      return response;
    } catch (error) {
      if (!isUnauthenticatedError(error)) {
        throw error;
      }
      this.token = void 0;
      await this.ensureAuthenticated();
      try {
        const response = await unary(method, request, this.timeoutMs, this.createAuthMetadata());
        this.refreshTokenDeadline();
        return response;
      } catch (retryError) {
        if (isUnauthenticatedError(retryError)) {
          const message = retryError instanceof Error ? retryError.message : String(retryError);
          throw new Error(`${methodName} failed authentication: ${message}`);
        }
        throw retryError;
      }
    }
  }
  async ensureAuthenticated() {
    if (!this.username && !this.password) {
      return;
    }
    if (!this.token || Date.now() >= this.tokenRefreshDeadline) {
      await this.login();
    }
  }
  createAuthMetadata() {
    const metadata = new grpc.Metadata();
    if (this.token) {
      metadata.set("authorization", this.token);
    }
    return metadata;
  }
  refreshTokenDeadline() {
    this.tokenRefreshDeadline = Date.now() + this.tokenTimeoutMs;
  }
}
function isUnauthenticatedError(error) {
  return error instanceof Error && "code" in error && error.code === grpc.status.UNAUTHENTICATED;
}
function getStringMetadataValue(metadata, key) {
  const value = metadata.get(key)[0];
  if (typeof value === "string") {
    return value;
  }
  return value == null ? void 0 : value.toString("utf8");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BosApiClient
});
//# sourceMappingURL=BosApiClient.js.map
