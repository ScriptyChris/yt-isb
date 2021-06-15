const { writeFileSync } = require('fs');
const { resolve } = require('path');
const minify = require('babel-minify');

const createScript = () => {
  window.fetch(`http://127.0.0.1:@port/youtube-app`, { mode: 'no-cors' }).then(
    () => console.log('YouTube app started!'),
    (error) => {
      console.error('YouTube app error:', error);

      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style = `
        min-width: 48px;
        max-width: 96px;
        width: 50%;
        height: 32px;
        background: green;
        border-color: white;
        margin-top: 16px;
      `;
      closeButton.addEventListener('click', () => errorAlertWrapper.remove(), { once: true });
      const errorAlertWrapper = document.createElement('div');
      errorAlertWrapper.style = `
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(2px);
      `;
      const errorAlert = document.createElement('aside');
      errorAlert.style = `
        position: absolute;
        top: 16px;
        left: 50vw;
        transform: translateX(-50%);
        width: 75vw;
        padding: 32px;
        background: black;
        border: 4px solid red;
        display: flex;
        flex-direction: column;
        align-items: center;
      `;
      const errorAlertPStyle = 'style="all: revert;"';
      errorAlert.innerHTML = `<div>
        <p ${errorAlertPStyle}>Unable to open YouTube app. :(</p>
        <details>
          <summary><span style="border-bottom: 1px dashed red;">Error message:</span></summary>
          <span style="color: red;">${error}</span>
        </details>
        <p ${errorAlertPStyle}>It's probably due to CSP limitations on that page. You can check devtools console for further info.</p>
        <p ${errorAlertPStyle}>Please try using bookmarklet again on a different page.</p>
        <p ${errorAlertPStyle}>You are welcome to <a href="https://github.com/ScriptyChris/yt-isb/issues">create an issue</a> containing URL of page where bookmarklet doesn't work.</p>
        <p>Thank you for feedback! :)</p>
      </div>`;

      errorAlert.appendChild(closeButton);
      errorAlertWrapper.appendChild(errorAlert);
      document.body.appendChild(errorAlertWrapper);
    }
  );
};

function createBookmarklet() {
  const script = createScript.toString().replace('@port', process.env.APPLICATION_PORT);
  const minifiedScript = minify(script.replace(/(\r\n|\n\r|\n|\t)+|\s{2,}/g, '').slice(7, -1)).code;
  const bookmarklet = `javascript: (()=>{${minifiedScript}})();`;

  writeFileSync(resolve(__dirname, '../bookmarkletScript.uri'), bookmarklet);
}

module.exports = createBookmarklet;
