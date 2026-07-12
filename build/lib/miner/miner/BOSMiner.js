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
var BOSMiner_exports = {};
__export(BOSMiner_exports, {
  BOSMiner: () => BOSMiner,
  buildBosMinerBackupConfigCommand: () => buildBosMinerBackupConfigCommand,
  patchBosMinerPowerTargetConfig: () => patchBosMinerPowerTargetConfig
});
module.exports = __toCommonJS(BOSMiner_exports);
var import_MinerFeature = require("../model/MinerFeature");
var import_CGMiner = require("./CGMiner");
var import_ssh2 = require("ssh2");
const BOSMINER_CONFIG_PATH = "/etc/bosminer.toml";
const BOSMINER_CONFIG_BACKUP_PATH = "/etc/bosminer.toml.iobroker-power-target.bak";
const BOSMINER_STOP_COMMAND = "/etc/init.d/bosminer stop";
const BOSMINER_START_COMMAND = "/etc/init.d/bosminer start";
var BOSMinerCommand = /* @__PURE__ */ ((BOSMinerCommand2) => {
  BOSMinerCommand2["pause"] = "pause";
  BOSMinerCommand2["resume"] = "resume";
  return BOSMinerCommand2;
})(BOSMinerCommand || {});
class BOSMiner extends import_CGMiner.CGMiner {
  /**
   *
   */
  async start() {
    await this.sendCommand("resume" /* resume */, "", false);
  }
  /**
   *
   */
  async stop() {
    await this.sendCommand("pause" /* pause */, "", false);
  }
  /**
   *
   * @param powerTarget - target power in watts
   */
  async setPowerTarget(powerTarget) {
    const config = await this.runSshCommand(`cat ${shellQuote(BOSMINER_CONFIG_PATH)}`);
    const patchedConfig = patchBosMinerPowerTargetConfig(config, powerTarget);
    const command = [
      buildBosMinerBackupConfigCommand(),
      BOSMINER_STOP_COMMAND,
      `printf '%s' ${shellQuote(patchedConfig)} > ${shellQuote(BOSMINER_CONFIG_PATH)}`,
      BOSMINER_START_COMMAND
    ].join(" && ");
    await this.runSshCommand(command);
  }
  /**
   *
   */
  getSupportedFeatures() {
    const unsupportedFeatures = [import_MinerFeature.MinerFeatureKey.cliArgs];
    return [
      ...super.getSupportedFeatures().filter((feature) => !unsupportedFeatures.includes(feature)),
      import_MinerFeature.MinerFeatureKey.running,
      import_MinerFeature.MinerFeatureKey.powerTarget
    ];
  }
  /**
   *
   */
  getLoggerName() {
    return `${super.getLoggerName()}BOSMiner[${this.settings.host}:${this.settings.port}]`;
  }
  /**
   *
   */
  getCliArgs() {
    return [];
  }
  runSshCommand(command) {
    return new Promise((resolve, reject) => {
      const client = this.createSshClient();
      let settled = false;
      const settle = (handler) => {
        if (settled) {
          return;
        }
        settled = true;
        client.end();
        handler();
      };
      client.on("ready", () => {
        client.exec(command, (execError, stream) => {
          if (execError) {
            settle(() => reject(execError));
            return;
          }
          let stdout = "";
          let stderr = "";
          stream.on("close", (code) => {
            if (code === 0) {
              settle(() => resolve(stdout));
              return;
            }
            settle(
              () => reject(
                new Error(
                  `SSH command failed with exit code ${code != null ? code : "unknown"}: ${stderr || stdout}`
                )
              )
            );
          }).on("data", (data) => {
            stdout += data.toString("utf8");
          });
          stream.stderr.on("data", (data) => {
            stderr += data.toString("utf8");
          });
        });
      }).on("error", (error) => {
        settle(() => reject(error));
      }).connect(this.getSshConnectionConfig());
    });
  }
  createSshClient() {
    return new import_ssh2.Client();
  }
  getSshConnectionConfig() {
    var _a, _b;
    return {
      host: this.settings.host,
      port: (_a = this.settings.sshPort) != null ? _a : 22,
      username: this.settings.username || "root",
      // TODO: fix this
      password: (_b = this.settings.password) != null ? _b : "",
      readyTimeout: Math.max(this.settings.pollInterval, 1e4)
    };
  }
}
function patchBosMinerPowerTargetConfig(config, powerTarget, timestamp = Math.floor(Date.now() / 1e3)) {
  let patchedConfig = upsertTomlSectionKey(config, "format", "timestamp", String(timestamp));
  patchedConfig = upsertTomlSectionKey(patchedConfig, "autotuning", "enabled", "true");
  patchedConfig = upsertTomlSectionKey(patchedConfig, "autotuning", "mode", "'power_target'");
  patchedConfig = upsertTomlSectionKey(patchedConfig, "autotuning", "power_target", String(powerTarget));
  return `${patchedConfig.replace(/\s+$/, "")}
`;
}
function buildBosMinerBackupConfigCommand() {
  return `test -f ${shellQuote(BOSMINER_CONFIG_BACKUP_PATH)} || cp ${shellQuote(BOSMINER_CONFIG_PATH)} ${shellQuote(BOSMINER_CONFIG_BACKUP_PATH)}`;
}
function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}
function upsertTomlSectionKey(config, section, key, value) {
  const sectionHeader = findTomlSectionHeader(config, section);
  if (sectionHeader === void 0) {
    const suffix = config.endsWith("\n") ? "" : "\n";
    return `${config}${suffix}
[${section}]
${key} = ${value}
`;
  }
  const nextSectionStart = findNextTomlSectionStart(config, sectionHeader.contentStart);
  const sectionContentEnd = nextSectionStart != null ? nextSectionStart : config.length;
  const sectionContent = config.slice(sectionHeader.contentStart, sectionContentEnd);
  const keyRegex = new RegExp(`^(\\s*${escapeRegExp(key)}\\s*=\\s*)[^#\\r\\n]*?([ \\t]*(?:#.*)?)$`, "m");
  if (keyRegex.test(sectionContent)) {
    const patchedSectionContent = sectionContent.replace(keyRegex, `$1${value}$2`);
    return `${config.slice(0, sectionHeader.contentStart)}${patchedSectionContent}${config.slice(sectionContentEnd)}`;
  }
  const separator = sectionContent === "" || sectionContent.endsWith("\n") ? "" : "\n";
  return `${config.slice(0, sectionContentEnd)}${separator}${key} = ${value}
${config.slice(sectionContentEnd)}`;
}
function findTomlSectionHeader(config, section) {
  const sectionRegex = new RegExp(`^\\s*\\[${escapeRegExp(section)}]\\s*(?:#.*)?(?:\\r?\\n|$)`, "m");
  const match = sectionRegex.exec(config);
  if (!match) {
    return void 0;
  }
  return { contentStart: match.index + match[0].length };
}
function findNextTomlSectionStart(config, startIndex) {
  const nextSectionRegex = /^\s*\[[^\]]+]\s*(?:#.*)?(?:\r?\n|$)/m;
  const match = nextSectionRegex.exec(config.slice(startIndex));
  return match ? startIndex + match.index : void 0;
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BOSMiner,
  buildBosMinerBackupConfigCommand,
  patchBosMinerPowerTargetConfig
});
//# sourceMappingURL=BOSMiner.js.map
