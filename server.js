// server.js
var express = require('express');
var path = require('path');
var compression = require('compression');
// var email = require('emailjs/email');
var bodyParser = require('body-parser');

var PORT = process.env.PORT || 8081;

var app = express()
app.use(compression())
    //Serve static content for the app from the "dist" directory in the application directory.
app.use(express.static(__dirname + '/dist'));
// Mount the middleware at "/public" to serve static content only when their request path is prefixed with "/public".
app.use("/public", express.static(__dirname + '/public'));
app.use(bodyParser.json());



// app.post('/sendmail', function(req, res) {
//     var server = email.server.connect({
//         user: "oliver.kemmis",
//         password: "pa55w0rd",
//         host: "smtp.mail.me.com",
//         port: "587",
//         tls: true
//     });
//     let textToSend = req.body.name + ' ' + req.body.surname + ' email: ' + req.body.email + ' mobile: ' + req.body.phone + ' role: ' + req.body.detail + ' Company: ' + req.body.company + ' requested an API key';
//     server.send({
//         text: textToSend,
//         from: "giorgio.mazzei@icloud.com",
//         to: 'giorgio.mazzei@outlook.com',
//         subject: "API key request"
//     }, function(err, message) {
//         if (err)
//             console.log(err);
//         else
//             res.json({ success: true, msg: 'sent' });
//     });
// });

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist', 'index.html'));
})

app.listen(PORT, function() {
    console.log('The server is running @ PORT:' + PORT);
})