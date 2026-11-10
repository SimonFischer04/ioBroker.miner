// Playwright helpers for the dev-server admin (http://127.0.0.1:8081). Uses the pre-installed playwright.
//   const { openDeviceManager } = require('<this dir>/admin.js');
//   const { browser, page } = await openDeviceManager({ scale: 2 });
const { chromium } = require('playwright');

const ADMIN = process.env.ADMIN_URL || 'http://127.0.0.1:8081';

/**
 * Dismisses admin's "Did you know?" tip dialog, shown on every fresh browser context.
 *
 * @param page - the Playwright page
 */
async function dismissTips(page) {
    const ok = page.getByRole('button', { name: 'Ok' });
    if (await ok.count()) {
        await ok.first().click();
        await page.waitForTimeout(500);
    }
}

/**
 * Opens a page in admin (hash route, e.g. '#tab-objects') with the tip dismissed.
 *
 * @param hash - admin hash route, e.g. '#tab-objects'
 * @param root0 - options
 * @param root0.scale - deviceScaleFactor: 2 for screenshots a person looks at
 */
async function openAdmin(hash = '', { scale = 1 } = {}) {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: scale });
    const page = await context.newPage();
    // not 'networkidle': admin keeps a socket open, that never settles
    await page.goto(`${ADMIN}/${hash}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);
    await dismissTips(page);
    return { browser, page };
}

/**
 * Opens the instance settings of miner.0 on its "Devices" tab (the device manager).
 *
 * @param options - see openAdmin
 */
async function openDeviceManager(options) {
    const { browser, page } = await openAdmin('#tab-instances/config/system.adapter.miner.0', options);
    await page
        .getByRole('tab', { name: /Devices/ })
        .first()
        .click();
    await page.waitForTimeout(4000);
    return { browser, page };
}

module.exports = { ADMIN, openAdmin, openDeviceManager, dismissTips };
