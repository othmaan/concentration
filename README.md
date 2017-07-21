# concentration
Concentration game

## Project structure
The Project has 2 main folders 
1. mobile folder which has cross platform app
2. backend folder has backend code

## Dependencies
1. NodeJs v6.x.x https://nodejs.org/en/download/
2. Cordova CLI v7.0.1 https://cordova.apache.org/docs/en/latest/guide/cli/

## Task time
- Analysis 6 hours
- Backend 3 hours
- Frontend 16 hours
Over 2 weekends.

## Analysis & decisions 
- Choice of stack to use. For frontend I've chosen Polymer https://www.polymer-project.org/ as I'm quite enthusiat about it, please take a look on article I wrote about it https://www.linkedin.com/pulse/faster-future-webnative-webcomponents-ahmed-othman
- Backend is written is NodeJs. Framework used is SailsJs http://sailsjs.com/ which is a superset of ExpressJs. Reason for that is it gives quite good support for writing data-driven/API-first REST apis.  It bundles a powerful ORM which simplify data access layer & just works no matter what database you're using.
- Business:
  - How to calculate score. I choosed trials based scoring system.
  - Start/End game. Game starts directly after opening the app, user get to play, then user object (name, score) is persistent on the backend.
  - Images fetching is happening on the app. The app directly calls 500px api. Images are cached per session.
  - How to scramble cards.
  
 ## Challenges
 - Web components are not fully supported in all mobile browser. One chanllenge I faced was on Safari was that shadow DOM was not fully supported on Safari. https://stackoverflow.com/questions/30599628/webcomponents-js-shadow-dom-host-selector-does-not-work-on-safari-and-firefox
 - Native Module system is not fully supported as well. I decided to user require.js or any AMD but ditched the idea for simplicity. https://pawelgrzybek.com/native-ecmascript-modules-in-the-browser/
 - Touch delay on Safari. https://developers.google.com/web/updates/2013/12/300ms-tap-delay-gone-away I user FastClick polyfill by FT Labs.
 
 
## Run locally
- Backend: 
  - Open terminal. Type `cd /backend`
  - Install dependencies. `npm install sails -g`
  - `node app.js`
  - Choose option 3 to select disk persistency & migration schema.  
  
- Frontend:
  -  Open terminal. Type `cd /mobile/src`
  - Install dependencies. Type `npm install http-server -g` to install simple server.
  - Type `http-server` to serve files. Then open browser at http://localhost:8080/
  - LIMITATION: cross-origin requests needs to be enabled. Please read below.

## Run app
- iOS app is localed at mobile/platforms/ios
- Android is located at mobile/platforms/android

## Limitation
- To run fronend code, cross-origin requests needs to be enabled. https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en plugin can be used for Chrome. 
- Development is in progress. Backend will not work on mobile unless hosted. (In progress)
- Android app is not built yet. Will update soon.
- After hosting backend code, the will be no need to run anything locally & app should work out of the box when connected to internet.
 
