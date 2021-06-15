const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const createNavPreventionInfoPopup = require('./navPreventionPopup');

const YOUTUBE_URL = 'https://www.youtube.com/';
const ABOUT_BLANK_URL = 'about:blank';

const REG_EXPS = {
  YOUTUBE_URL_REGEXP: /^(http[s]?:\/\/)?(www\.)?youtube\.[^.]+\/.*/,
  GOOGLE_SEARCH_URL_REGEXP: /^(http[s]?:\/\/)?(www\.)?google\.[^.]+\/.*/,
  GOOGLE_SERVICES_URL_REGEXP: /^(http[s]?:\/\/)?([a-z]+\.)?(youtube|google)\.[^.]+\/.*/,
  NON_STANDARD_URL_REGEXP: new RegExp(`^((${ABOUT_BLANK_URL}$)|(chrome://))`),
};

const isAllowedPageUrl = (url) =>
  REG_EXPS.NON_STANDARD_URL_REGEXP.test(url) ||
  (REG_EXPS.GOOGLE_SERVICES_URL_REGEXP.test(url) && !REG_EXPS.GOOGLE_SEARCH_URL_REGEXP.test(url));
const handlePageNavigations = (page) => {
  console.log('[handlePageNavigations] url:', page.url());

  page.on('framenavigated', async (frame) => {
    console.log('\n[framenavigated] frame.url:', frame.url());

    if (!isAllowedPageUrl(frame.url())) {
      console.log('Detected navigation outside of allowed URLs scope! Going back to YouTube...');

      const pageUrl = page.url();
      const goBackPageUrl = REG_EXPS.YOUTUBE_URL_REGEXP.test(pageUrl) ? pageUrl : YOUTUBE_URL;

      await page.goto(goBackPageUrl);
      await createNavPreventionInfoPopup(page.evaluate.bind(page));
    }
  });
};
const openAppropriatePage = async ({ browserPages, browserNewPage }) => {
  const pages = await browserPages();
  const isSingleBlankPage = pages.length === 1 && pages[0].url() === ABOUT_BLANK_URL;

  if (isSingleBlankPage) {
    const page = await browserNewPage();
    handlePageNavigations(page);
    await page.goto(YOUTUBE_URL);

    const blankPage = (await browserPages()).find((maybeBlankPage) =>
      REG_EXPS.NON_STANDARD_URL_REGEXP.test(maybeBlankPage.url())
    );
    await blankPage.close();
  } else {
    handlePageNavigations(pages.pop());
  }
};

async function launchYouTubeApp(markDisconnectedBrowser) {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: process.env.CHROMIUM_BROWSER_PATH,
    userDataDir: process.env.BROWSER_PROFILE_PATH,
    args: ['--no-first-run', '--no-default-browser-check'],
  });

  browser.once('disconnected', markDisconnectedBrowser);
  browser.on('targetcreated', async (target) => {
    console.log('[targetcreated] url:', target.url());

    const page = await target.page();

    if (target.type() === 'page') {
      handlePageNavigations(page);
    }
  });

  await openAppropriatePage({
    browserPages: browser.pages.bind(browser),
    browserNewPage: browser.newPage.bind(browser),
  });

  return async function restoreBrowserView() {
    const lastPage = (await browser.pages()).pop();
    await lastPage.bringToFront();
  };
}

module.exports = launchYouTubeApp;
