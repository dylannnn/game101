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