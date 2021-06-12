const puppeteer = require('puppeteer-core');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
  const browser = await puppeteer.launch({ headless: false, executablePath: process.env.CHROMIUM_BROWSER_PATH });
  const page = await browser.newPage();
  await page.goto('https://youtube.com');

  setTimeout(async () => await browser.close(), 3000);
})();
