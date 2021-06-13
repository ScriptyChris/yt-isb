const app = require('express')();
const launchYouTubeApp = require('./youtube-launcher');

let isBrowserLaunched = false;
let isPageOpened = false;
let restoreBrowserView = () => {};

const handleGETEndpoint = async (_, res) => {
  console.log('\n----\nRequest received');

  if (isBrowserLaunched && isPageOpened) {
    console.log('Restore browser view', restoreBrowserView);
    restoreBrowserView().then(getOnSuccess(res), getOnError(res));
  } else {
    console.log('Launch YT app');
    launchYouTubeApp(markDisconnectedBrowser, markClosedPage).then(getOnSuccess(res), getOnError(res));
  }
};
const getOnSuccess = (res) => {
  return function onSuccess(_restoreBrowserView) {
    console.log('Ok');

    isBrowserLaunched = true;
    isPageOpened = true;

    if (_restoreBrowserView) {
      restoreBrowserView = _restoreBrowserView;
    }

    res.status(200).send();
  };
};
const getOnError = (res) => {
  return function onError(error) {
    console.error('YouTube app error:', error);

    isBrowserLaunched = false;
    isPageOpened = false;
    restoreBrowserView = () => {};

    res.status(500).send();
  };
};
const markDisconnectedBrowser = async () => {
  console.log('Browser disconnected');

  isBrowserLaunched = false;
  isPageOpened = false;
};
const markClosedPage = async () => {
  console.log('Page closed');

  isPageOpened = false;
};

function listenToYouTubeNavRequests() {
  app.get('/youtube-app', handleGETEndpoint);
  app.listen(process.env.APPLICATION_PORT, () =>
    console.log(`YouTube app is listening on port: ${process.env.APPLICATION_PORT}`)
  );
}

module.exports = listenToYouTubeNavRequests;
