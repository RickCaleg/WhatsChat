const express = require('express'),
    router = express.Router(),
    path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '../../views/index/index.html'));
});

router.post('/GetUsuario', (req, res) => {
    const usuario = global.chat.GetUsuario(req.body.idUsuario);
    res.json(usuario);
});

router.post('/AtualizarUsuario', (req, res) => {
    const sucesso = global.chat.AtualizarUsuario(req.body.idUsuario, req.body.socketID);
    res.json({ sucesso: sucesso });
});

module.exports = router;