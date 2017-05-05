var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'ab-tools:9200',
    log: 'trace'
});

var express = require('express');
var path = require('path');
var compression = require('compression');
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 8081;

var app = express()
app.use(compression())
//Serve static content for the app from the "dist" directory in the application directory.
app.use(express.static(__dirname + '/dist'));
// Mount the middleware at "/public" to serve static content only when their request path is prefixed with "/public".
app.use("/public", express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist', 'index.html'));
})

app.listen(PORT, function () {
    console.log('The server is running @ PORT:' + PORT);
})