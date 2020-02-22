const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

global.io = io;
global.usuarios = {};

global.__baseDir = __dirname;
app.use(express.json());

app.use('/content', express.static('./app/content'));
app.use('/files/fotosUsuarios', express.static('./app/files/fotosUsuarios'));

//Routers
const indexController = require('./controllers/indexController'),
    usuarioController = require('./controllers/usuarioController');

app.use('/', indexController);
app.use('/usuario', usuarioController);
//Routers

module.exports = server;