---
name: run-adapter
description: Launch this ioBroker adapter for real (js-controller + admin via @iobroker/dev-server) against a fake Avalon Nano 3S miner, and drive / screenshot the admin UI (device manager card, device controls, add-device form, notifications, objects tree) with Playwright. Use to run the adapter, check a change in the actual admin, or take screenshots.
---

# Run the adapter in ioBroker admin

Verified in a Linux cloud container (Node 22, pre-installed Playwright/Chromium). Paths are relative to the repo root.
Scripts live in `.claude/skills/run-adapter/scripts/`.

## 1. One-time setup (≈3 min, needs the npm registry)

```bash
npx -y @iobroker/dev-server@latest setup --adminPort 8081
```

Creates `.dev-server/default` (git-ignored: `.gitignore` ignores dot-directories). Admin is then served at
`http://127.0.0.1:8081` (a Browsersync proxy in front of admin's real port, 20426).

## 2. Start

```bash
npm run build                                   # dev-server installs the adapter from build/ when it starts
nohup node .claude/skills/run-adapter/scripts/fake-avalon.js > /tmp/fake-avalon.log 2>&1 &
nohup npx @iobroker/dev-server@latest run default > /tmp/devrun.log 2>&1 &
until curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8081/ | grep -q 200; do sleep 2; done
```

After a code change: `npm run build`, then stop and start `dev-server run` again (or use `dev-server watch default`).

**If the previous run was killed** (container restart, `kill`), js-controller refuses to start the instances with
`terminated with code 7 (ADAPTER_ALREADY_RUNNING)` in `/tmp/devrun.log`, and dev-server exits with
`ECONNREFUSED 127.0.0.1:20426`, because their `alive` states are still `true`. Clear them, then start again:

```bash
cd .dev-server/default
for i in admin.0 miner.0; do ./iob state set system.adapter.$i.alive false true; done
```

## 3. Enable the instance (first run only)

The `miner.0` instance is created disabled:

```bash
cd .dev-server/default && ./iob start miner.0
./iob state get system.adapter.miner.0.alive     # {"val":true,...}
```

(`./iob set miner.0 --enabled true` does not work: "has no setting enabled".)

## 4. The fake miner

`scripts/fake-avalon.js` serves the cgminer API on `127.0.0.1:4028` from `src/lib/miner/fixture/nano3s-*.json`:
the poll (`summary+version+stats+litestats`), `stats`, and every `ascset` (answered `ASC 0 set OK`; `0,filter-clean,1`
also resets the filter runtime). Each request is logged, so `/tmp/fake-avalon.log` shows what the adapter sent.

- `FILTER_MIN=<minutes>`: litestats `Filter[]` value, default 45000 (≈31 days, so the dust filter reminder is due)
- `PORT=<port>`: listen port, default 4028

## 5. Add a device

The device lives in the ioBroker object DB, so this is needed once per `.dev-server` setup:

```bash
node .claude/skills/run-adapter/scripts/add-avalon-device.js "Avalon Nano 3S" 127.0.0.1   # prints: added "Avalon Nano 3S"
```

It fills the device manager's "Add new device" form. The form rejects an empty MAC address ("MAC address required"),
so the script enters the fixture's MAC. Check the data arrived:

```bash
cd .dev-server/default && ./iob list states "miner.0.miner.*.custom.*"
```

## 6. Drive the admin with Playwright

`scripts/admin.js` exports `openAdmin(hash, { scale })` and `openDeviceManager({ scale })`. Use `scale: 2` for
screenshots a person will look at.

```js
const { openDeviceManager } = require('/home/user/ioBroker.miner/.claude/skills/run-adapter/scripts/admin.js');
(async () => {
  const { browser, page } = await openDeviceManager({ scale: 2 });
  await page.screenshot({ path: 'card.png', clip: { x: 200, y: 170, width: 360, height: 380 } }); // first device card
  await browser.close();
})();
```

Things that are not obvious (viewport 1400×900, CSS pixels):

- **Don't wait for `networkidle`**: admin keeps a socket open, so `goto` times out. Use `domcontentloaded` + ~6 s.
- **Tip dialog**: every fresh browser context shows "Did you know?". `openAdmin` clicks its `Ok`.
- **Device manager**: instance settings `#tab-instances/config/system.adapter.miner.0`, then the "Devices" tab.
  Toolbar: refresh at (247, 139), "+" (add device) at (300, 139).
- **First device card**: the controls button (gamepad icon, bottom right of the card) is at (498, 516). It opens the
  controls dialog: profile, custom features per channel (Light, Display, Dust Filter → "Reset Filter Reminder"),
  closed with `Escape`. The card itself shows the read-only custom features (e.g. Filter Runtime, Filter Cleaning Due).
- **Notifications**: the bell, bottom left at (51, 893), shows the count. It opens a dialog with the adapter's
  notifications (e.g. "Dust filter needs cleaning").
- **Objects tree**: `openAdmin('#tab-objects')`, fill the `ID` filter (`page.getByPlaceholder(/ID/)`), then click
  "expand one level" (306, 24) about 6 times. "Collapse all nodes" (350, 24) is right next to it.
- **A poll takes up to 10 s** (pollInterval 10000): after a control write, wait ≥12 s, then refresh the device list
  before the card shows the new values.

## 7. Stop

```bash
pkill -f "dev-server" ; pkill -f fake-avalon.js
```

Deleting a device: use the trash icon on its card. `./iob object del` waits on a confirmation prompt (`-y` doesn't skip it).
