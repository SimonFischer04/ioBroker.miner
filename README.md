![Logo](admin/miner.png)
# ioBroker.miner

[![NPM version](https://img.shields.io/npm/v/iobroker.miner.svg)](https://www.npmjs.com/package/iobroker.miner)
[![Downloads](https://img.shields.io/npm/dm/iobroker.miner.svg)](https://www.npmjs.com/package/iobroker.miner)
![Number of Installations](https://iobroker.live/badges/miner-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/miner-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.miner.png?downloads=true)](https://nodei.co/npm/iobroker.miner/)

**Tests:** ![Test and Release](https://github.com/SimonFischer04/ioBroker.miner/workflows/Test%20and%20Release/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/SimonFischer04/ioBroker.miner/badge.svg?branch=main)](https://coveralls.io/github/SimonFischer04/ioBroker.miner?branch=main)

## miner adapter for ioBroker

Interact with different crypto miner apis

## Roadmap
- [X] v0.1: device management, trm implementation
- [X] more miners support: bos+, xmrig, avalon, ...?
- [ ] implement more features (controls + info from devices)
- [ ] pools support (started: Braiins Pool)
- [ ] device discover
- [ ] sentry
- [ ] more: see Todo.md / issues

## Usage
When adding a new device inside the instance settings (or inside the Admin DeviceManager Tab) you should get a dialog like this:

![AddDevice.png](docs/AddDevice.png)

The options should be pretty self-explanatory. All of them also have tooltips with more details. If anything is still unclear feel free to ask in an issue, discussion or the forum. 

### Braiins OS miner types
There are two Braiins miner implementations because Braiins changed the API stack across firmware generations:

- `bos`: use this for official Braiins OS firmware `>= 23.03`, typically Antminer S19 series and newer. This implementation uses the Braiins OS Public API (PAPI) over gRPC.
- `bosMiner`: use this for legacy Braiins OS firmware `< 23.03`, typically pre-S19 devices such as Antminer S9 and S17 series. This keeps using the older CGMiner-compatible API.

`bosMiner` also supports the `control.powerTarget` state. Legacy Braiins OS does not expose this through the CGMiner-compatible API, so the adapter uses an SSH workaround: it logs in to the miner, updates `power_target` in the `[autotuning]` section and `timestamp` in the `[format]` section of `/etc/bosminer.toml`, stores a backup at `/etc/bosminer.toml.iobroker-power-target.bak`, stops `bosminer`, writes the config, and starts `bosminer` again. Configure valid SSH credentials for `bosMiner` devices; the default username is `root` with no password.

Warning: changing `control.powerTarget` on old `bosMiner` devices requires a full `bosminer` stop/start cycle. Do not change this value frequently; use it for deliberate target changes, not for rapid automation loops.

If you are unsure which one to choose, check the firmware generation/device family first:

- S19/S21/T19 and newer Braiins OS images are listed in the current firmware download flow and should normally use `bos`.
- S17 images are published as `v 23.01` and S9 images as `v 22.08.1` on the Braiins download page, so those legacy generations should use `bosMiner`.

References:
- Braiins OS Public API: https://academy.braiins.com/braiins-os/papi-about
- Braiins OS firmware downloads: https://braiins.com/os-firmware/download

### Avalon web login without the app
The web interface of Avalon Nano 3 / 3S miners has no password form: it shows a QR code that has to be scanned with the Avalon Family app. The adapter can approve that login instead:

1. Enter the miner's web password in the device settings (`web password`). It is the password set for the miner in the Avalon Family app.
2. Open the miner's IP address in the browser, so the login page with the QR code shows.
3. Click "Approve web login" on the device in the device manager. The browser is logged in within 5 seconds.

This does the same as scanning the QR code: the adapter sends the miner the `qr_auth` command the app sends, signed with the web password.

Firmware checks for BOS use the last reported control-board type and installed version, including while the device is offline or disabled. A BOS device must have reported its identity at least once. Avalon update checks currently cover the exact Nano 3 model only: the app's `nano3` feed has no verified Nano 3S compatibility, so Nano 3S update status remains unknown.

### Pools
Besides miners, the adapter can monitor your account at a mining pool. Add a device with category `pool` in the device manager. Supported pools:

- **Braiins Pool** (`braiinsPool`, BTC): uses the pool's [monitoring API](https://academy.braiins.com/en/braiins-pool/monitoring/). In the pool's web interface go to Settings → Access Profiles, create an access profile with web API access and generate a token, then enter it as `API token`. The adapter only reads statistics: hashrate, worker counts and states, balance and rewards.

  The pool updates its statistics about once a minute and allows only about one API request every 5 seconds (more can get your IP banned). Each poll makes two requests, so the poll interval is at least 30 seconds (default: 60 seconds), and requests of all Braiins Pool accounts in the adapter are spaced 5 seconds apart.

`info.online` of a pool shows whether the pool API is reachable with the token; it switches to `false` after 3 failed polls in a row.

## Object model

All objects are created under:

`miner.<instance>.miner.<minerId>`

`<minerId>` is the stable ID from the device configuration (`settings.id`). This allows multiple miner processes on the same host.

### Groups (channels)
- `info`: identity/config/firmware/connection meta
- `stats`: live performance metrics (hashrate, shares, power, temps, ...)
- `control`: writable controls (start/stop, reboot, ...)
- `raw`: raw API payloads (expert)

### Entities (optional subtrees)
Some miners expose sub-entities. If available, they are placed below the miner:
- `pools.<index>...`
- `hardware.gpus.<index>...`
- `hardware.hashboards.<index>...`

### Examples
- `miner.0.miner.<minerId>.enabled`
- `miner.0.miner.<minerId>.control.running`
- `miner.0.miner.<minerId>.stats.totalHashrate`
- `miner.0.miner.<minerId>.hardware.gpus.0.stats.temp`
- `miner.0.miner.<minerId>.raw.stats`

### Enable / disable a miner
Each miner device has a writable top-level `enabled` state:

`miner.<instance>.miner.<minerId>.enabled`

Set this state to `false` to disable the miner in the adapter at runtime. Disabled miners are unloaded and no polling/control handling is active for them. Set it back to `true` to initialize the miner again without restarting the adapter.

This is different from `control.running`: `enabled` controls whether the adapter manages the miner at all, while `control.running` asks a supported miner to start or stop mining.

### Pool tree
```
miner.0
  pool
    <poolId>                         (device)
      enabled                        (boolean)  enable/disable polling of this pool account
      info
        poolType                     (string)   e.g. braiinsPool
        username                     (string)   account name at the pool
        online                       (boolean)  pool API reachable
        lastSeen                     (number)   unix ms
      stats
        hashrate5m / hashrate60m / hashrate24h / hashrateYesterday   (number) H/s
        workersOk / workersLow / workersOff / workersDisabled        (number)
      rewards
        currentBalance / todayReward / estimatedReward / allTimeReward (number) BTC
      workers
        <worker>                     (channel)  worker name without the "<username>." prefix
          name                       (string)   full worker name
          state                      (string)   ok / low / off / disabled
          lastShare                  (number)   unix ms
          hashrateScoring / hashrate5m / hashrate60m / hashrate24h   (number) H/s
      raw
        stats                        (string)   raw API responses (expert)
```

### Example tree
This is just an overview / idea / plan. Not all of them are implemented yet, but it should give you an idea of the intended structure and naming. The actual implementation may differ in some details, but the general structure should be similar to this.
```
miner.0
  miner
    <minerId>                        (device)
      enabled                        (boolean)  enable/disable adapter handling for this miner
      info                           (channel)
        minerType                    (string)   e.g. xmRig / teamRedMiner / bosMiner
        host                         (string)
        version                      (string)   (maps to feature: version)
        online                        (boolean)  derived from lastSeen
        lastSeen                     (number)   unix ms
      stats                          (channel)
        totalHashrate                (number)   H/s (maps to feature: totalHashrate)
        power                        (number)   W
        dynamicPowerTarget           (number)   W, current dynamic target reported by miner
        efficiency                   (number)   H/W
        acceptedShares               (number)
        rejectedShares               (number)
      control                        (channel)  (writable states only here, top-level)
        running                      (boolean)  start/stop (maps to feature: running)
        reboot                       (boolean)  "button"
        profile                      (string)   performance profile (e.g. low/medium/high)
        powerTarget                  (number)   W, configured target to write to miner
      pools                          (channel)
        0                            (channel)
          info
            url                      (string)
            user                     (string)
          stats
            status                   (string)
            acceptedShares           (number)
            rejectedShares           (number)
        1 ...
      hardware                       (channel)
        gpus                         (channel)
          0                          (channel)
            info
              name                   (string)
            stats
              hashrate               (number)
              temp                   (number)   °C
              fanRpm                 (number)
              power                  (number)
          1 ...
        hashboards                   (channel)  (ASICs)
          0
            stats
              hashrate               (number)
              temp                   (number)
      raw                            (channel)
        stats                        (object/string) raw miner payload (maps to feature: rawStats)
```

## Changelog
<!--
    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**
-->
### **WORK IN PROGRESS**
* (claude) **NEW**: Pool support, starting with Braiins Pool: add a device with category `pool` and the API token of a Braiins Pool access profile to get the account's hashrate, worker counts, per-worker state and hashrate, balance and rewards under `miner.<instance>.pool.<poolId>`

### 1.2.0 (2026-11-03)
* (claude) **NEW**: Check miners for available firmware/software updates once a day and show them in the device manager: new states `info.latestVersion` and `info.updateAvailable` (Braiins OS, XMRig, TeamRedMiner, IceRiver OC firmware, Avalon Nano 3), plus the auto-upgrade status for Braiins OS. Can be turned off in the instance settings; a "check for updates" action checks right away (#195)
* (claude) **FIXED**: `info.online` now switches to `false` after 3 failed polls in a row and back to `true` on the next successful one; a poll that hangs counts as failed after its poll interval, but at least 30 seconds, and requests to Braiins OS (gRPC) and XMRig / IceRiver (HTTP) are now cancelled after that time instead of staying open (#222)
* (claude) **NEW**: Avalon Nano 3 / 3S: log a browser in to the miner's web interface without the Avalon Family app. Enter the miner's web password in the device settings, open the miner's login page, and use the new "Approve web login" device action (#182)
* (claude) **NEW**: Avalon: WiFi signal strength as `info.rssi` (dBm), also shown in the device manager. It comes with the existing poll request, so it costs no extra round-trip; miners on a wired connection or with firmware that doesn't report it simply leave it empty (#178)
* (claude) **NEW**: Power target in the device manager (Braiins OS `bos` and `bosMiner`): set it right on the device card; the value is only sent with "Set" or Enter, not on every keystroke. For `bos`, `control.powerTarget` now shows the miner's configured target (also when it was changed elsewhere), and values outside the range the miner accepts are rejected before they reach it (#176)
* (claude) **ENHANCED**: An unreachable miner is no longer polled at the full rate: the time between polls doubles with every failed poll, up to 5 minutes and slightly randomized, and returns to the poll interval on the next successful poll (#175)
* (claude) **FIXED**: The instance stayed yellow ("Connected to device or service": no) although its miners were reachable: `info.connection` now lists the reachable miners (comma-separated, like the sonoff adapter does), so the instance is green while at least one enabled miner is reachable and the admin shows which ones (#231)
* (SimonFischer04) Dependency updates

### 1.1.0 (2026-07-12)
- (copilot) Adapter requires node.js >= 22 now
* (SimonFischer04) **NEW**: Added a new `bos` miner type for newer Braiins OS firmware using the Braiins Public API
* (SimonFischer04) **ENHANCED**: Extended legacy `bosMiner` devices with writable `control.powerTarget` support for deliberate power target changes
* (SimonFischer04) **NEW**: Added top-level `enabled` state to dynamically enable or disable miner handling at runtime
* (SimonFischer04) **FIXED**: Removed example configuration (option1, option2) from native section and code (fixes #126 / E5040)

### 1.0.4 (2026-04-07)
* (SimonFischer04) fix repo url in package-json

### 1.0.3 (2026-04-07)
* (SimonFischer04) increase admin requirement to fix DM (does not work at all with current stable 7.7.22)

### 1.0.2 (2026-04-07)
* (SimonFischer04) **CI/CD**: Migrated deploy workflow from NPM classic tokens to Trusted Publishing (OIDC) (fixes #80)
* (SimonFischer04) cleanup readme

[Older changelogs can be found there](CHANGELOG_OLD.md)

## Credits
- the logo was created using ChatGPT

## License

Copyright (c) 2026 SimonFischer04 <simi.fischa@gmail.com>  

This project is licensed under the GNU General Public License v3.0 - see [LICENSE](https://github.com/SimonFischer04/ioBroker.miner/blob/main/LICENSE) for details.
