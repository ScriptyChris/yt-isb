const puppeteer = require('puppeteer-core');
require('dotenv').config();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: process.env.CHROMIUM_BROWSER_PATH,
    args: [`--user-data-dir=${process.env.BROWSER_PROFILE_PATH}`, '--no-first-run', '--no-default-browser-check'],
  });
  const [page] = await browser.pages();
  await page.goto('https://youtube.com');

  // setTimeout(async () => await browser.close(), 3000);
})();
