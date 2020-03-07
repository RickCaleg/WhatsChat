const express = require('express'),
    router = express.Router(),
    path = require('path'),
    fileUpload = require('express-fileupload'),
    fs = require('fs');
const UPLOAD_PATH = path.join(__baseDir + `/files/fotosUsuarios/`);

router.use(fileUpload());

global.io.on('connection', function (socket) {
    global.io.emit('refresh-users');

    socket.on('disconnect', () => {
        //Get user data
        const usuario = global.chat.GetUsuarioBySocketId(socket.id);
        if (usuario && usuario.nome) {

            //Wait for 3 seconds and verify if user is still logged on
            setTimeout(() => {
                const _usuario = global.chat.GetUsuario(usuario.idUsuario);

                //If user is not connected anymore, warning the other users
                if (_usuario && !global.io.sockets.sockets[_usuario.socketID])
                    global.chat.UsuarioDesconectado(_usuario.idUsuario);
            }, 3000);
        }
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
            const idUsuario = global.chat.AdicionarUsuario({
                idUsuario: 0,
                nome: req.body.nome,
                foto: newFileName,
                socketID: req.body.socketID
            });

            res.json({ sucesso: true, mensagem: 'Usuário salvo com sucesso', caminhoImagem: filePath, idUsuario: idUsuario });
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