const express = require('express');
const cors = require('cors');
const axios = require('axios');

const path = require('path');

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(express.static('./'));

app.use(function(req, res, next) {
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', function (req, res) {
    return res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/guess-number', function (req, res) {
    var query = Object.keys(req.query).map(function (key) {
        return key + '=' + req.query[key]
    }).join('&');

    // Try to solve session getting lost  error
    axios.defaults.withCredentials = true;

    // [BUG] PHPSESSID is missing
    axios.get('https://www.drukzo.nl.joao.hlop.nl/challenge.php?' + query, {withCredentials: true})
        .then(response => {
            return res.status(response.status).json(response.data);
        })
        .catch(error => {
            return res.status(403).json(error);
        });
});

app.listen(3000);
console.log('Node server running on port ' + 3000);