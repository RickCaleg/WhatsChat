const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    Chat = require('./business/chat'),
    path = require('path'),
    fs = require('fs');

global.chat = Chat;
global.io = io;

global.__baseDir = __dirname;
app.use(express.json());

const UPLOAD_PATH = path.join(__baseDir + `/files/fotosUsuarios/`);

fs.readdir(UPLOAD_PATH, (err, files) => {
    if (err) {
        if (!fs.existsSync(UPLOAD_PATH)) {
            fs.mkdirSync(UPLOAD_PATH, {
                recursive: true
            });
        } else {
            throw err;
        }
    }

    if (files && files.length > 0) {
        for (const file of files) {
            fs.unlink(path.join(UPLOAD_PATH, file), err => {
                if (err) throw err;
            });
        }
    }
});

app.use('/content', express.static('./app/content'));
app.use('/files/fotosUsuarios', express.static('./app/files/fotosUsuarios'));

//Routers
const indexController = require('./controllers/indexController'),
    usuarioController = require('./controllers/usuarioController');

app.use('/', indexController);
app.use('/usuario', usuarioController);
//Routers

module.exports = server;