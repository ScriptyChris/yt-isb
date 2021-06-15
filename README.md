# YT-isb

YouTube in sandboxed browser.

Main goal of creating the app was to be able to be logged in to Google just for sake of using YouTube, separating the possibility 
of browsing the Internet while being logged in to Google.

## About

The app consists of two parts:
- bookmarklet (client)
- server ([Express](https://www.npmjs.com/package/express) & [Puppeteer](https://www.npmjs.com/package/puppeteer))

Running bookmarklet notifies server to launch or restore (if app is already running) separate browser with YouTube pages. 
The app uses Chromium based browser (such as Chrome or Brave) with specified user profile - the user may prefer to 
**use the app on a separate profile** from his "daily one".

Relying on user's profile let's the app remember user login sessions in YouTube (including opened tabs and so on).

The app prevents from visiting other pages than YouTube (except pages and redirections required to login to Google), 
which makes it kind of standalone web browser based YouTube player.

## How to run?

1. `npm ci`
2. Create `.env` file based on `.env.example` - you may want to modify `*_PATH` variables according to your operating system and needs
3. `npm run start:prod`
4. [Create a bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet#Installation) in your daily browser using contents of generated `bookmarkletScript.uri` file.
5. Click on the bookmark and the app should be launched in separate browser with YouTube opened.

You can run `npm run start:dev` to conveniently modify the app code ([nodemon](https://www.npmjs.com/package/nodemon), 
[ESLint](https://www.npmjs.com/package/eslint) and [Prettier](https://www.npmjs.com/package/prettier) provided).

## Known issues

- Bookmarklet may not work on some pages, because of [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP). 
Some workarounds might be added in the future or app's client part will be refactored to the form of browser extension.
