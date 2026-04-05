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
var MinerAdapterDeviceManagement_exports = {};
__export(MinerAdapterDeviceManagement_exports, {
  default: () => MinerAdapterDeviceManagement_default
});
module.exports = __toCommonJS(MinerAdapterDeviceManagement_exports);
var import_dm_utils = require("@iobroker/dm-utils");
var import_adapter_core = require("@iobroker/adapter-core");
var import_Category = require("./miner/model/Category");
var import_MinerSettings = require("./miner/model/MinerSettings");
var import_IOBrokerMinerSettings = require("../miner/model/IOBrokerMinerSettings");
var import_MinerFactory = require("./miner/miner/MinerFactory");
var import_MinerFeature = require("./miner/model/MinerFeature");
class MinerAdapterDeviceManagement extends import_dm_utils.DeviceManagement {
  /**
   *
   */
  async getInstanceInfo() {
    const baseInfo = await super.getInstanceInfo();
    const data = {
      ...baseInfo,
      apiVersion: "v3",
      actions: [
        {
          id: "refresh",
          title: "",
          description: import_adapter_core.I18n.getTranslatedObject("Refresh device list"),
          handler: this.handleRefresh.bind(this)
        },
        {
          id: "newDevice",
          title: "",
          description: import_adapter_core.I18n.getTranslatedObject("Add new device to Miner"),
          handler: this.handleNewDevice.bind(this)
        }
        // TODO
        /*{
            id: 'discover',
            icon: 'fas fa-search',
            title: '',
            description: {
                en: 'Discover new devices',
                de: 'Neue Geräte suchen',
                ru: 'Обнаружить новые устройства',
                pt: 'Descubra novos dispositivos',
                nl: 'Ontdek nieuwe apparaten',
                fr: 'Découvrir de nouveaux appareils',
                it: 'Scopri nuovi dispositivi',
                es: 'Descubrir nuevos dispositivos',
                pl: 'Odkryj nowe urządzenia',
                'zh-cn': '发现新设备',
                uk: 'Виявити нові пристрої'
            },
            handler: this.handleDiscover.bind(this)
        }*/
      ]
    };
    return data;
  }
  /**
   * Refreshes the device list.
   *
   * @param _context - the action context
   */
  handleRefresh(_context) {
    this.adapter.log.info("handleRefresh");
    return { refresh: true };
  }
  /**
   * Shows the new device form and adds the device.
   *
   * @param context - the action context for showing forms and messages
   */
  async handleNewDevice(context) {
    this.adapter.log.info("handleNewDevice");
    const settings = await this.showDeviceConfigurationForm(
      context,
      {
        category: "miner",
        settings: {
          minerType: void 0,
          id: crypto.randomUUID(),
          host: "",
          pollInterval: this.adapter.config.pollInterval,
          claymore: {
            minerType: "claymoreMiner",
            host: "",
            password: crypto.randomUUID(),
            port: 3333
          },
          sg: {
            minerType: "sgMiner",
            host: "",
            port: 4028
          }
        },
        name: "",
        mac: "",
        enabled: true
      },
      // TODO: improve this (by making IOBrokerMinerSettings generic?, ...)
      import_adapter_core.I18n.getTranslatedObject("Add new device")
    );
    this.adapter.log.debug(`handleNewDevice settings: ${JSON.stringify(settings)}`);
    if (settings === void 0) {
      return { refresh: false };
    }
    await this.adapter.addDevice(settings);
    return { refresh: true };
  }
  async showDeviceConfigurationForm(context, existingSettings, title) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    this.adapter.log.debug(`showDeviceConfigurationForm existingSettings: ${JSON.stringify(existingSettings)}`);
    if (!(0, import_IOBrokerMinerSettings.isMiner)(existingSettings)) {
      this.adapter.log.error(
        `MinerAdapterDeviceManagement/showDeviceConfigurationForm existingSettings ${JSON.stringify(existingSettings)} is not a miner.`
      );
      return void 0;
    }
    const result = await context.showForm(
      {
        type: "panel",
        items: {
          category: {
            type: "select",
            format: "dropdown",
            newLine: true,
            label: import_adapter_core.I18n.getTranslatedObject("Category"),
            tooltip: "category of the iobroker thing (miner or pool)",
            options: import_Category.categoryKeys.map((key) => {
              return {
                value: key,
                // TODO: translate(key)
                label: key
              };
            })
          },
          minerType: {
            type: "select",
            format: "dropdown",
            newLine: true,
            label: import_adapter_core.I18n.getTranslatedObject("Miner type"),
            tooltip: "type of miner / firmware",
            options: import_MinerSettings.minerTypeKeys.map((key) => {
              return {
                value: key,
                // TODO: translate(key)
                label: key
              };
            })
          },
          id: {
            type: "text",
            newLine: true,
            label: import_adapter_core.I18n.getTranslatedObject("id"),
            tooltip: "unique id of the device, used to identify the device in the adapter",
            readOnly: true,
            noClearButton: true,
            disabled: true
          },
          name: {
            type: "text",
            newLine: true,
            // trim: false,
            label: import_adapter_core.I18n.getTranslatedObject("Name"),
            tooltip: "name for the user to identify the device"
          },
          host: {
            type: "text",
            newLine: true,
            trim: true,
            placeholder: "fe80::42",
            label: import_adapter_core.I18n.getTranslatedObject("IP address"),
            tooltip: "IP address (or host) of the device"
          },
          // TODO: get by request
          mac: {
            type: "text",
            newLine: true,
            trim: true,
            placeholder: "00:00:00:00:00:00",
            label: import_adapter_core.I18n.getTranslatedObject("MAC address"),
            tooltip: "MAC address of the device"
          },
          // TODO: show only if miner requires polling? possible to dynamically add fields to form?
          pollInterval: {
            type: "number",
            newLine: true,
            min: 100,
            label: import_adapter_core.I18n.getTranslatedObject("poll interval"),
            tooltip: "interval to poll the device for new data"
          },
          password: {
            type: "text",
            // type password does not allow to show the password generated as default value
            // type: 'password',
            newLine: true,
            label: import_adapter_core.I18n.getTranslatedObject("password"),
            tooltip: "password used to connect to the device api. Adapter generates a random, secure and unique one for each device by default. But can of course be changed if needed."
          },
          enabled: {
            type: "checkbox",
            newLine: true,
            label: import_adapter_core.I18n.getTranslatedObject("enabled"),
            tooltip: "whether the device is enabled or not. Disabled devices will do nothing (not get polled, control does not work, ...). Useful if you f.e. shut one off temporarily."
          }
        }
      },
      {
        data: {
          category: existingSettings.category,
          id: existingSettings.settings.id,
          minerType: existingSettings.settings.minerType,
          name: existingSettings.name,
          host: existingSettings.settings.host,
          mac: existingSettings.mac,
          pollInterval: existingSettings.settings.pollInterval,
          // TODO: implement this properly
          password: (_b = (_a = existingSettings.settings.claymore) == null ? void 0 : _a.password) != null ? _b : "",
          // TODO: implement this properly
          enabled: existingSettings.enabled
        },
        title
      }
    );
    console.log("add device result: ", result);
    if (result === null || result === void 0) {
      return void 0;
    }
    if (result.mac === "") {
      await context.showMessage(import_adapter_core.I18n.translate("MAC address required"));
    }
    if (result.mac !== "") {
    }
    if (result.host === "") {
      await context.showMessage(import_adapter_core.I18n.translate("Please enter an IP address"));
      return void 0;
    }
    if (result.host !== "") {
    }
    if (!(0, import_IOBrokerMinerSettings.isMiner)({ category: result.category })) {
      this.log.error(
        `MinerAdapterDeviceManagement/handleNewDevice category ${result.category} is not yet supported.`
      );
      return void 0;
    }
    let minerSettings = {
      id: result.id,
      minerType: result.minerType,
      host: result.host
    };
    switch (minerSettings.minerType) {
      case "teamRedMiner": {
        const pollInterval = (_c = result.pollInterval) != null ? _c : this.adapter.config.pollInterval;
        const trmSettings = {
          pollInterval,
          claymore: {
            minerType: "claymoreMiner",
            pollInterval,
            host: minerSettings.host,
            password: result.password,
            port: 3333
            // TODO: make configurable
          },
          sg: {
            minerType: "sgMiner",
            pollInterval,
            host: minerSettings.host,
            port: 4028
            // TODO: make configurable
          }
        };
        minerSettings = {
          ...minerSettings,
          ...trmSettings
        };
        break;
      }
      case "claymoreMiner": {
        const pollInterval = (_d = result.pollInterval) != null ? _d : this.adapter.config.pollInterval;
        const claymoreSettings = {
          pollInterval,
          port: 3333,
          // TODO: make configurable
          password: result.password
        };
        minerSettings = {
          ...minerSettings,
          ...claymoreSettings
        };
        break;
      }
      case "sgMiner": {
        const pollInterval = (_e = result.pollInterval) != null ? _e : this.adapter.config.pollInterval;
        const sgSettings = {
          pollInterval,
          port: 4028
          // TODO: make configurable
        };
        minerSettings = {
          ...minerSettings,
          ...sgSettings
        };
        break;
      }
      case "xmRig": {
        const pollInterval = (_f = result.pollInterval) != null ? _f : this.adapter.config.pollInterval;
        const xmRigSettings = {
          pollInterval,
          port: 8420,
          // TODO: make configurable
          password: result.password
        };
        minerSettings = {
          ...minerSettings,
          ...xmRigSettings
        };
        break;
      }
      case "iceRiverOcMiner": {
        const pollInterval = (_g = result.pollInterval) != null ? _g : this.adapter.config.pollInterval;
        const iceRiverOcSettings = {
          pollInterval,
          port: 443,
          // TODO: make configurable
          password: result.password
        };
        minerSettings = {
          ...minerSettings,
          ...iceRiverOcSettings
        };
        break;
      }
      case "bosMiner": {
        const pollInterval = (_h = result.pollInterval) != null ? _h : this.adapter.config.pollInterval;
        const bosSettings = {
          pollInterval,
          port: 4028
          // TODO: make configurable
        };
        minerSettings = {
          ...minerSettings,
          ...bosSettings
        };
        break;
      }
      case "avalonMiner": {
        const pollInterval = (_i = result.pollInterval) != null ? _i : this.adapter.config.pollInterval;
        const avalonSettings = {
          pollInterval,
          port: 4028
          // TODO: make configurable
        };
        minerSettings = {
          ...minerSettings,
          ...avalonSettings
        };
        break;
      }
      default: {
        this.adapter.log.error(
          `MinerAdapterDeviceManagement/handleNewDevice minerType ${minerSettings.minerType} not yet supported`
        );
        return void 0;
      }
    }
    const settings = {
      category: result.category,
      name: result.name,
      mac: result.mac,
      enabled: result.enabled,
      settings: minerSettings
    };
    return settings;
  }
  async loadDevices(context) {
    const devices = await this.adapter.getDevicesAsync();
    context.setTotalDevices(devices.length);
    for (const device of devices) {
      context.addDevice({
        id: device._id,
        name: device.common.name,
        hasDetails: true,
        actions: [
          {
            id: "delete",
            description: import_adapter_core.I18n.getTranslatedObject("Delete this device"),
            handler: this.handleDeleteDevice.bind(this)
          },
          {
            id: "settings",
            description: import_adapter_core.I18n.getTranslatedObject("Settings"),
            handler: this.handleSettingsDevice.bind(this)
          }
        ]
      });
    }
  }
  async handleDeleteDevice(id, context) {
    const response = await context.showConfirmation(
      import_adapter_core.I18n.getTranslatedObject("Do you really want to delete the device %s?", id)
    );
    if (!response) {
      return { refresh: "none" };
    }
    const success = await this.adapter.delDevice(id);
    if (!success) {
      await context.showMessage(import_adapter_core.I18n.getTranslatedObject("Can not delete device %s", id));
      return { refresh: "none" };
    }
    return { refresh: "all" };
  }
  async handleSettingsDevice(id, context) {
    const obj = await this.adapter.getObjectAsync(id);
    if (obj == null) {
      this.adapter.log.error(`MinerAdapterDeviceManagement/handleSettingsDevice object ${id} not found`);
      return { refresh: "none" };
    }
    const currentSettings = (0, import_IOBrokerMinerSettings.decryptDeviceSettings)(
      obj.native,
      (value) => this.adapter.decrypt(value)
    );
    const newSettings = await this.showDeviceConfigurationForm(
      context,
      currentSettings,
      import_adapter_core.I18n.getTranslatedObject("Settings")
    );
    this.adapter.log.debug(`handleSettingsDevice newSettings: ${JSON.stringify(newSettings)}`);
    if (newSettings === void 0) {
      return { refresh: "none" };
    }
    await this.adapter.updateDevice(newSettings);
    if (!(0, import_IOBrokerMinerSettings.isMiner)(currentSettings) || !(0, import_IOBrokerMinerSettings.isMiner)(newSettings)) {
      this.adapter.log.error(`MinerAdapterDeviceManagement/handleSettingsDevice settings are not miners`);
      return { refresh: "none" };
    }
    if (currentSettings.name != newSettings.name) {
      return { refresh: "all" };
    }
    return { refresh: "devices" };
  }
  /**
   * Returns the device details panel for the given device.
   *
   * @param id - the ioBroker object id of the device
   */
  async getDeviceDetails(id) {
    this.adapter.log.info(`Get device details ${id}`);
    const obj = await this.adapter.getObjectAsync(id);
    if (obj == null) {
      const error = `getDeviceDetails device ${id} not found`;
      this.log.error(error);
      return { error };
    }
    const settings = (0, import_IOBrokerMinerSettings.decryptDeviceSettings)(
      obj.native,
      (value) => this.adapter.decrypt(value)
    );
    if (!(0, import_IOBrokerMinerSettings.isMiner)(settings)) {
      const error = `getDeviceDetails category ${obj.native.category} not yet supported`;
      this.log.error(error);
      return { error };
    }
    const dummyMiner = (0, import_MinerFactory.createMiner)(settings.settings);
    return {
      id,
      schema: {
        type: "panel",
        items: {
          name: {
            type: "text",
            label: import_adapter_core.I18n.getTranslatedObject("Name"),
            newLine: true,
            sm: 12,
            disabled: "true"
          },
          minerCliParams: {
            type: "text",
            label: import_adapter_core.I18n.translate("Miner CLI parameters"),
            sm: 12,
            disabled: "true",
            hidden: !dummyMiner.getSupportedFeatures().includes(import_MinerFeature.MinerFeatureKey.cliArgs)
          }
        },
        style: {
          minWidth: 420
        }
      },
      data: {
        name: obj.common.name,
        minerCliParams: dummyMiner.getCliArgs().join(" ")
      }
    };
  }
  /**
   *
   */
  async close() {
  }
}
var MinerAdapterDeviceManagement_default = MinerAdapterDeviceManagement;
//# sourceMappingURL=MinerAdapterDeviceManagement.js.map
