# YT-isb

YouTube in sandboxed browser

## About

The app consists of two parts:
- bookmarklet
- server

Running bookmarklet notifies server to launch or restore (if app is already running) separate browser with YouTube pages. 
The app uses Chromium based browser (such as Chrome or Brave) with separate user profile. Therefore, the app remembers 
that you are logged to Google services, so you can use YouTube's subscription features etc. 

It's useful when you want to log in to Google just to use YouTube, but don't want to 
browse the Internet while still being logged to Google.

## How to run?

1. `npm ci`
2. Create `.env` file based on `.env.example` - you may want to modify `*_PATH` variables according to your operating system and needs
3. `npm run start:prod`
4. [Create a bookmarklet](https://en.wikipedia.org/wiki/Bookmarklet#Installation) in your daily browser using contents of generated `bookmarkletScript.uri` file.
5. Click on the bookmark and the app should be launched in separate browser with YouTube opened.

You can run `npm run start:dev` to conveniently ([nodemon](https://www.npmjs.com/package/nodemon), [ESLint](https://www.npmjs.com/package/eslint) and 
[Prettier](https://www.npmjs.com/package/prettier) provided) modify the app code.

## Known issues

Bookmarklet may not work on some pages, because of [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP). 
Some workarounds might be added in the future or app's client part will be refactored to the form of browser extension.
