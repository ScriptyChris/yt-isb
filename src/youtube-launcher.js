const puppeteer = require('puppeteer-core');
const createNavPreventionInfoPopup = require('./navPreventionPopup');

const YOUTUBE_URL = 'https://www.youtube.com/';
const YOUTUBE_URL_REGEXP = /^(https:\/\/(((www\.)?(youtube))|((consent\.)?(youtube|google)))\.[a-z]+)/;
const allowedPageUrlRegExp = new RegExp(
  `${YOUTUBE_URL_REGEXP.source}|https://accounts[.]google[.][a-z]+|(about:blank$)`
);

const isDisallowedPageUrl = (url) => !allowedPageUrlRegExp.test(url);
const attachPageEvents = async (page) => {
  await page.setRequestInterception(true);

  page.on('request', async (req) => {
    if (req.isNavigationRequest() && isDisallowedPageUrl(req.url())) {
      console.log('Aborted req to nav beyond YouTube! /req.url:', req.url(), ' /page.url:', page.url());

      await req.abort();

      const pageUrl = page.url();
      const pageToGoTo = YOUTUBE_URL_REGEXP.test(pageUrl) ? pageUrl : YOUTUBE_URL;

      await page.goto(pageToGoTo);
      await createNavPreventionInfoPopup(page.evaluate.bind(page));
    } else {
      await req.continue();
    }
  });
};

async function launchYouTubeApp(markDisconnectedBrowser) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: process.env.CHROMIUM_BROWSER_PATH,
    args: [
      `--user-data-dir=${process.env.BROWSER_PROFILE_PATH}`,
      '--no-first-run',
      '--no-default-browser-check',
      // '--kiosk',
    ],
  });
  browser.on('disconnected', markDisconnectedBrowser);
  browser.on('targetcreated', async (target) => {
    console.log('Target created url:', target.url(), ' /type:', target.type());

    const page = await target.page();

    if (target.type() === 'page') {
      await attachPageEvents(page);
    }
  });

  const [page] = await browser.pages();
  await attachPageEvents(page);

  await page.goto(YOUTUBE_URL);

  return async () => {
    const lastPage = (await browser.pages()).pop();
    await lastPage.bringToFront();
  };
}

module.exports = launchYouTubeApp;
