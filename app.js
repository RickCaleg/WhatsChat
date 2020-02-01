const express = require('express');
const app = express();
const path = require('path');

app.use('/content', express.static('./content'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3000, function () {
    console.log('O servidor está escutando a porta 3000');
});