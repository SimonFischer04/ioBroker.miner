// Adds an Avalon device pointing at the fake miner through the device manager's "Add new device" form.
//   node add-avalon-device.js [name] [host]
const path = require('path');
const { openDeviceManager } = require(path.join(__dirname, 'admin.js'));

(async () => {
    const [name = 'Avalon Nano 3S', host = '127.0.0.1'] = process.argv.slice(2);
    const { browser, page } = await openDeviceManager();
    try {
        // the "+" in the device manager toolbar
        await page.mouse.click(300, 139);
        const dialog = page.getByRole('dialog');
        await dialog.waitFor();
        // comboboxes: Category, Miner type
        await dialog.getByRole('combobox').nth(1).click();
        await page.getByRole('option', { name: 'avalonMiner' }).click();
        await page.waitForTimeout(600);
        // text boxes: id (generated), Name, IP address, MAC address (required by the form), ...
        const boxes = dialog.getByRole('textbox');
        await boxes.nth(1).fill(name);
        await boxes.nth(2).fill(host);
        await boxes.nth(3).fill('e0:e1:a9:3e:f5:a5'); // the MAC from the Nano 3S fixture
        await dialog.getByRole('button', { name: 'OK' }).click();
        await page.waitForTimeout(5000);
        console.log(
            (await page.locator('body').innerText()).includes(name)
                ? `added "${name}"`
                : 'device not shown, check the admin log',
        );
    } finally {
        await browser.close();
    }
})();
