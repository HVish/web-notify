'use strict';
const express = require('express');
const app = express();
const webpush = require('web-push');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/push', function(req, response) {
    const vapidPublicKey = 'BJ7qGfC27QrXGJCA3snSJpD9o_dV8ooS0SpxTP65YsAEOCvhXBZwJzmjL3T1Wgq4aDaI1DXsLJkzRtK7YYqs3ho';
    const vapidPrivateKey = 'DpkzfXOwyu8d75hVijFsQRocQ0Hi1jpRSTeRD0uPsAg';
    const payload = JSON.stringify(req.body.data);

    const options = {
        vapidDetails: {
            subject: 'http://localhost:3000/',
            publicKey: vapidPublicKey, //These are the keys you generated in step 1
            privateKey: vapidPrivateKey //These are the keys you generated in step 1
        }
    }
    webpush.sendNotification(
        JSON.parse(req.body.subscription),
        payload,
        options
    ).then((res) => {
        console.log(res);
        response.send('ok');
    }).catch((err) => {
        console.log(err);
        response.send('error');
    });
});

app.listen(port, function() {
    console.log(`Server started on ${port} port! Please visit: http://localhost:${port}`);
});
