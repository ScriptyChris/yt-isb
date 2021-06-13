const app = require('express')();
const puppeteer = require('puppeteer-core');
require('dotenv').config();

listenToYouTubeNavRequests();

function listenToYouTubeNavRequests() {
  let isBrowserLaunched = false;
  let isPageOpened = false;
  let restoreBrowserView = () => {};

  app.get('/youtube-app', handleGETEndpoint);
  app.listen(process.env.APPLICATION_PORT, () =>
    console.log(`YouTube app is listening on port: ${process.env.APPLICATION_PORT}`)
  );

  async function handleGETEndpoint(_, res) {
    console.log('\n----\nRequest received');

    if (isBrowserLaunched && isPageOpened) {
      console.log('Restore browser view', restoreBrowserView);
      restoreBrowserView().then(getOnSuccess(res), getOnError(res));
    } else {
      console.log('Launch YT app');
      launchYouTubeApp(markDisconnectedBrowser, markClosedPage).then(getOnSuccess(res), getOnError(res));
    }
  }

  function getOnSuccess(res) {
    return function onSuccess(_restoreBrowserView) {
      console.log('Ok');

      isBrowserLaunched = true;
      isPageOpened = true;

      if (_restoreBrowserView) {
        restoreBrowserView = _restoreBrowserView;
      }

      res.status(200).send();
    };
  }

  function getOnError(res) {
    return function onError(error) {
      console.error('YouTube app error:', error);

      isBrowserLaunched = false;
      isPageOpened = false;
      restoreBrowserView = () => {};

      res.status(500).send();
    };
  }

  function markDisconnectedBrowser() {
    console.log('Browser disconnected');

    isBrowserLaunched = false;
    isPageOpened = false;
  }

  function markClosedPage() {
    console.log('Page closed');

    isPageOpened = false;
  }
}

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
