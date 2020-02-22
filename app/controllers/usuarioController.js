const express = require('express'),
    router = express.Router(),
    path = require('path'),
    fileUpload = require('express-fileupload'),
    fs = require('fs');
const UPLOAD_PATH = path.join(__baseDir + `/files/fotosUsuarios/`);

router.use(fileUpload());

global.io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        const usuario = global.chat.GetUsuario(socket.id);
        if (!usuario)
            return;

        ApagarFoto(usuario.fotoUsuario);
        global.chat.RemoverUsuario(socket.id);
    });
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '../../views/usuario/usuario.html'));
});

router.post('/', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0)
        res.json({ sucesso: false, mensagem: 'Nenhum arquivo encontrado' });

    const fotoUsuario = req.files.fotoUsuario;
    const fileExtension = path.extname(fotoUsuario.name);
    const newFileName = req.body.socketID + fileExtension;
    const filePath = UPLOAD_PATH + newFileName;

    fotoUsuario.mv(filePath, function (err) {
        if (err) {
            res.json({ sucesso: false, mensagem: 'Erro ao salvar a foto do usuário', err: err });
        } else {
            global.chat.AdicionarUsuario({
                idUsuario: 0,
                nome: req.body.nome,
                foto: newFileName,
                socketID: req.body.socketID
            });

            res.json({ sucesso: true, mensagem: 'Usuário salvo com sucesso', caminhoImagem: filePath });
        }
    });
});

router.delete('/', (req, res) => {
    const fileName = req.body.fileName;
    ApagarFoto(fileName, err => {
        if (err)
            res.json({ sucesso: false, mensagem: 'Erro ao apagar a foto do usuário' });
        else
            res.json({ sucesso: true, mensagem: 'Foto apagada com sucesso' });
    });
});

function ApagarFoto(fotoUsuario, callback = function () { }) {
    const filePath = UPLOAD_PATH + fotoUsuario;

    fs.unlink(filePath, callback);
}

module.exports = router;