const { writeFileSync } = require('fs');
const { resolve } = require('path');

const createScript = () => {
  window.fetch(`http://127.0.0.1:@port/youtube-app`, { mode: 'no-cors' }).then(
    () => console.log('YouTube app started!'),
    (error) => console.error('YouTube app error:', error)
  );
};

function createBookmarklet() {
  const script = createScript.toString().replace('@port', process.env.APPLICATION_PORT);
  const bookmarklet = `javascript: (${script})();`;

  writeFileSync(resolve(__dirname, '../bookmarkletScript.uri'), bookmarklet);
}

module.exports = createBookmarklet;
