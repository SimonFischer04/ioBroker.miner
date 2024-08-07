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
var import_Category = require("./miner/model/Category");
var import_MinerSettings = require("./miner/model/MinerSettings");
var import_IOBrokerMinerSettings = require("../miner/model/IOBrokerMinerSettings");
class MinerAdapterDeviceManagement extends import_dm_utils.DeviceManagement {
  async getInstanceInfo() {
    const data = {
      ...super.getInstanceInfo(),
      actions: [
        {
          id: "newDevice",
          icon: "fas fa-plus",
          title: "",
          description: {
            en: "Add new device to Miner",
            de: "Neues Ger\xE4t zu Miner hinzuf\xFCgen",
            ru: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u043E\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E \u0432 Miner",
            pt: "Adicionar novo dispositivo ao Miner",
            nl: "Voeg nieuw apparaat toe aan Miner",
            fr: "Ajouter un nouvel appareil \xE0 Miner",
            it: "Aggiungi nuovo dispositivo a Miner",
            es: "Agregar nuevo dispositivo a Miner",
            pl: "Dodaj nowe urz\u0105dzenie do Miner",
            "zh-cn": "\u5C06\u65B0\u8BBE\u5907\u6DFB\u52A0\u5230Miner",
            uk: "\u0414\u043E\u0434\u0430\u0442\u0438 \u043D\u043E\u0432\u0438\u0439 \u043F\u0440\u0438\u0441\u0442\u0440\u0456\u0439 \u0434\u043E Miner"
          },
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
  async handleNewDevice(context) {
    var _a;
    this.adapter.log.info("handleNewDevice");
    const result = await context.showForm(
      {
        type: "panel",
        items: {
          category: {
            type: "select",
            newLine: true,
            label: "category",
            // TODO: translate
            // TODO: FixMeLater
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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
            newLine: true,
            label: "minerType",
            // TODO: translate
            // TODO: FixMeLater
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            options: import_MinerSettings.minerTypeKeys.map((key) => {
              return {
                value: key,
                // TODO: translate(key)
                label: key
              };
            })
          },
          name: {
            type: "text",
            newLine: true,
            // TODO: FixMeLater
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // trim: false,
            label: {
              en: "Name",
              de: "Name",
              ru: "\u0418\u043C\u044F",
              pt: "Nome",
              nl: "Naam",
              fr: "Nom",
              it: "Nome",
              es: "Nombre",
              pl: "Nazwa",
              "zh-cn": "\u540D\u79F0",
              uk: "\u0406\u043C'\u044F"
            }
          },
          host: {
            type: "text",
            newLine: true,
            // TODO: FixMeLater
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            trim: true,
            placeholder: "fe80::42",
            label: {
              en: "IP address",
              de: "IP-Adresse",
              ru: "IP \u0430\u0434\u0440\u0435\u0441",
              pt: "Endere\xE7o de IP",
              nl: "IP adres",
              fr: "Adresse IP",
              it: "Indirizzo IP",
              es: "Direcci\xF3n IP",
              pl: "Adres IP",
              "zh-cn": "IP\u5730\u5740",
              uk: "IP \u0430\u0434\u0440\u0435\u0441\u0430"
            }
          },
          // TODO: get by request
          mac: {
            type: "text",
            newLine: true,
            // TODO: FixMeLater
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            trim: true,
            placeholder: "00:00:00:00:00:00",
            label: {
              en: "MAC address",
              de: "MAC-Adresse",
              ru: "MAC \u0430\u0434\u0440\u0435\u0441",
              pt: "Endere\xE7o MAC",
              nl: "MAC adres",
              fr: "Adresse MAC",
              it: "Indirizzo MAC",
              es: "Direcci\xF3n MAC",
              pl: "Adres MAC",
              "zh-cn": "MAC\u5730\u5740",
              uk: "MAC \u0430\u0434\u0440\u0435\u0441\u0430"
            }
          },
          // TODO: show only if miner requires polling? possible to dynamically add fields to form?
          pollInterval: {
            type: "number",
            newLine: true,
            // TODO: FixMeLater
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            min: 1e4,
            unit: "ms",
            label: {
              "en": "poll interval",
              // TODO: also fix translate in jsonConfig.json
              "de": "Abrufintervall",
              "ru": "\u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B",
              "pt": "intervalo de polui\xE7\xE3o",
              "nl": "poll-interval",
              "fr": "intervalle de sondage",
              "it": "intervallo di sondaggio",
              "es": "intervalo de encuesta",
              "pl": "przedzia\u0142 ankietowy",
              "uk": "\u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u043E\u043F\u0438\u0442\u0443\u0432\u0430\u043D\u043D\u044F",
              "zh-cn": "\u6C11\u610F\u8C03\u67E5\u95F4\u9694"
            }
          },
          password: {
            type: "text",
            // type password does not allow to show the password generated as default value
            // type: 'password',
            newLine: true,
            // TODO: FixMeLater
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // visible: true,
            label: {
              "en": "password",
              "de": "passwort",
              "ru": "\u043F\u0430\u0440\u043E\u043B\u044C",
              "pt": "senha",
              "nl": "wachtwoord",
              "fr": "mot de passe",
              "it": "password",
              "es": "contrase\xF1a",
              "pl": "has\u0142o",
              "uk": "\u0443\u0432\u0456\u0439\u0442\u0438",
              "zh-cn": "\u5BC6\u7801"
            }
          },
          enabled: {
            type: "checkbox",
            newLine: true,
            label: {
              "en": "enabled",
              "de": "aktiviert",
              "ru": "\u0432\u043A\u043B\u044E\u0447\u0435\u043D",
              "pt": "habilitado",
              "nl": "ingeschakeld",
              "fr": "activ\xE9",
              "it": "abilitata",
              "es": "habilitado",
              "pl": "w\u0142\u0105czone",
              "uk": "\u0443\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438",
              "zh-cn": "\u542F\u7528"
            }
          }
        }
      },
      {
        data: {
          category: "miner",
          minerType: void 0,
          name: "",
          host: "",
          mac: "",
          pollInterval: this.adapter.config.pollInterval,
          password: crypto.randomUUID(),
          enabled: true
        },
        title: {
          en: "Add new device",
          de: "Neues Ger\xE4t hinzuf\xFCgen",
          ru: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u043E\u0432\u043E\u0435 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u043E",
          pt: "Adicionar novo dispositivo",
          nl: "Voeg nieuw apparaat toe",
          fr: "Ajouter un nouvel appareil",
          it: "Aggiungi nuovo dispositivo",
          es: "Agregar nuevo dispositivo",
          pl: "Dodaj nowe urz\u0105dzenie",
          "zh-cn": "\u6DFB\u52A0\u65B0\u8BBE\u5907",
          uk: "\u0414\u043E\u0434\u0430\u0442\u0438 \u043D\u043E\u0432\u0438\u0439 \u043F\u0440\u0438\u0441\u0442\u0440\u0456\u0439"
        }
      }
    );
    console.log("add device result: ", result);
    if (result === null || result === void 0) {
      return { refresh: false };
    }
    if (result.mac === "") {
      await context.showMessage(`MAC address required`);
    }
    if (result.mac !== "") {
      if (!result.mac.match(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)) {
        await context.showMessage(`MAC address ${result.mac} is not valid`);
        return { refresh: false };
      }
    }
    if (result.host === "") {
      await context.showMessage(`Please enter an IP address`);
      return { refresh: false };
    }
    if (result.host !== "") {
      if (!result.host.match(/^(\d{1,3}\.){3}\d{1,3}$/) && false) {
        await context.showMessage(`IP address ${result == null ? void 0 : result.ip} is not valid`);
        return { refresh: false };
      }
    }
    if (!(0, import_IOBrokerMinerSettings.isMiner)({ category: result.category })) {
      this.log.error(`MinerAdapterDeviceManagement/handleNewDevice category ${result.category} is not yet supported.`);
      return { refresh: false };
    }
    let minerSettings = {
      id: crypto.randomUUID(),
      minerType: result.minerType
    };
    switch (minerSettings.minerType) {
      case "teamRedMiner": {
        const pollInterval = (_a = result.pollInterval) != null ? _a : this.adapter.config.pollInterval;
        const trmSettings = {
          pollInterval,
          claymore: {
            minerType: "claymoreMiner",
            pollInterval,
            host: result.host,
            password: result.password,
            port: 3333
            // TODO: make configurable
          },
          sg: {
            minerType: "sgMiner",
            pollInterval,
            host: result.host,
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
      default: {
        this.adapter.log.error(`MinerAdapterDeviceManagement/handleNewDevice minerType ${minerSettings.minerType} not yet supported`);
        return { refresh: false };
      }
    }
    const settings = {
      category: result.category,
      name: result.name,
      host: result.host,
      mac: result.mac,
      enabled: result.enabled,
      settings: minerSettings
    };
    await this.adapter.addDevice(settings);
    return { refresh: true };
  }
  async listDevices() {
    const devices = await this.adapter.getDevicesAsync();
    const arrDevices = [];
    console.error("alistDevices");
    debugger;
    for (const device of devices) {
      arrDevices.push({
        id: device._id,
        name: device.common.name
      });
    }
    return arrDevices;
  }
  async close() {
  }
}
var MinerAdapterDeviceManagement_default = MinerAdapterDeviceManagement;
//# sourceMappingURL=MinerAdapterDeviceManagement.js.map
