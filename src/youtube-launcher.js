const puppeteer = require('puppeteer-core');

async function launchYouTubeApp(markDisconnectedBrowser, markClosedPage) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: process.env.CHROMIUM_BROWSER_PATH,
    args: [`--user-data-dir=${process.env.BROWSER_PROFILE_PATH}`, '--no-first-run', '--no-default-browser-check'],
  });
  browser.on('disconnected', markDisconnectedBrowser);

  const [page] = await browser.pages();
  page.on('close', markClosedPage);
  await page.goto('https://youtube.com');

  return async () => {
    const lastPage = (await browser.pages()).pop();
    await lastPage.bringToFront();
  };
}

module.exports = launchYouTubeApp;
