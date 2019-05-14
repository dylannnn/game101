# game101

## IMPORTANT
Due to CORS on the localhost, please install Chrome extention: [Allow-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) and enable the CORS

## Or Try run a node server

### Install the dependencies

`npm install`

### Start Node Server

`node server.js`

### Uncomment line 247 from /js/app.js

## ISSUE

### Mising PHPSESSID

It seems the Service API not response the PHPSESSID from the header so that the application can't get the session ID and send it back with XHR

![XHR GET Response](/references/API-Response.jpg)

### CROS

It may have the CORS issue, try to install the Chrome extention: [Allow-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en) and enable the CORS


Windows
Just do follow steps:

Right click on desktop, add new shortcut
Add the target as "[PATH_TO_CHROME]\chrome.exe" --disable-web-security --disable-gpu --user-data-dir=~/chromeTemp
Click OK.
NOTE: On Windows 10 command will be: "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-gpu --user-data-dir=~/chromeTemp

OSX
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

Linux
google-chrome --disable-web-security

If you need access to local files for dev purposes like AJAX or JSON, you can use -–allow-file-access-from-files flag.