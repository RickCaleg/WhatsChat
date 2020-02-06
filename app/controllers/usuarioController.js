const express = require('express'),
    router = express.Router(),
    path = require('path'),
    fileUpload = require('express-fileupload'),
    fs = require('fs');
const UPLOAD_PATH = path.join(__baseDir + `/files/fotosUsuarios/`);

router.use(fileUpload());

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '../../views/usuario/usuario.html'));
});

router.post('/', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0)
        res.json({ sucesso: false, mensagem: 'Nenhum arquivo encontrado' });

    const fotoUsuario = req.files.fotoUsuario;
    const filePath = UPLOAD_PATH + fotoUsuario.name;

    fotoUsuario.mv(filePath, function (err) {
        if (err)
            res.json({ sucesso: false, mensagem: 'Erro ao salvar a foto do usuário', err: err });
        else
            res.json({ sucesso: true, mensagem: 'Usuário salvo com sucesso', caminhoImagem: filePath });
    });
});

router.delete('/', (req, res) => {
    const fileName = req.body.fileName;
    const filePath = UPLOAD_PATH + fileName;

    fs.unlink(filePath, err => {
        if (err)
            res.json({ sucesso: false, mensagem: 'Erro ao apagar a foto do usuário' });
        else
            res.json({ sucesso: true, mensagem: 'Foto apagada com sucesso' });
    });
});

module.exports = router;