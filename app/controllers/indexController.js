const express = require('express'),
    router = express.Router(),
    path = require('path'),
    fs = require('fs');

const UPLOAD_PATH = path.join(__baseDir + `/files/fotosUsuarios/`);

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

router.post('/Logout', (req, res) => {
    const usuario = global.chat.GetUsuario(req.body.idUsuario);
    ApagarFoto(usuario.foto, function (err) {
        global.chat.RemoverUsuario(req.body.idUsuario);
        if (err)
            res.json({ sucesso: false, mensagem: 'Erro ao apagar a foto do usuário' });
        else
            res.json({ sucesso: true, mensagem: 'Foto apagada com sucesso' });
    });

    global.chat.UsuarioDesconectado(usuario.idUsuario);
});

router.post('/ListarUsuarios', (req, res) => {
    const idUsuario = req.body.idUsuario;
    res.json(global.chat.ListarUsuarios(idUsuario));
});

router.post('/AdicionarMensagem', (req, res) => {
    global.chat.AdicionarMensagem(req.body.idUsuario, req.body.mensagem, req.body.nome);
    res.json({ sucesso: true, mensagem: 'Mensagem Adicionada com sucesso' });
});

function ApagarFoto(fotoUsuario, callback = function () { }) {
    const filePath = UPLOAD_PATH + fotoUsuario;

    fs.unlink(filePath, callback);
}

module.exports = router;