# Older changes
## 1.0.0 (2026-04-06)
* (SimonFischer04) **FIXED**: Added missing size attributes (xs, xl) to admin configuration fields
* (SimonFischer04) **ENHANCED**: Updated dependencies to recommended versions (admin 7.6.17, js-controller 6.0.11)
* (SimonFischer04) **ENHANCED**: Added copyright notice to README
* (SimonFischer04) **NEW**: Added support for Avalon (Canaan) devices via CGMiner-compatible socket API (port 4028), including start/stop (softon/softoff) and stats polling
* (SimonFischer04) **ENHANCED**: Restructured object model with dedicated channels for control, info, stats, and raw data (**breaking change** – legacy state paths are auto-cleaned on startup)
* (SimonFischer04) **NEW**: Added info states (minerType, host, online, lastSeen) and stats states (power, efficiency, acceptedShares, rejectedShares) to match the documented object model
* (SimonFischer04) **NEW**: Added reboot control state (button) with wiring in state change handler
* (SimonFischer04) **NEW**: Added running switch control to Device Manager for devices supporting the running feature
* (SimonFischer04) **NEW**: Added performance profile feature with control.profile state and Device Manager dropdown (low/medium/high) — initially for Avalon miners via ascset workmode command
* (SimonFischer04) **ENHANCED**: Renamed SGMiner to CGMiner throughout the codebase to better reflect the underlying API
* (SimonFischer04) **FIXED**: Fixed copyright formatting in README to satisfy ioBroker repository checker (fixes #95)

## 0.0.1 (2026-02-15)
* (SimonFischer04) initial release
