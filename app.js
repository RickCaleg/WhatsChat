const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');

const UPLOAD_PATH = path.join(__dirname + `/files/fotosUsuarios/`);

app.use(express.json());
app.use(fileUpload());
app.use('/content', express.static('./content'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/Usuario', function (req, res) {
    res.sendFile(path.join(__dirname + '/usuario.html'));
});

app.post('/Usuario', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0)
        res.json({ sucesso: false, mensagem: 'Nenhum arquivo encontrado' });

    const fotoUsuario = req.files.fotoUsuario;

    fotoUsuario.mv(UPLOAD_PATH + fotoUsuario.name, function (err) {
        if (err)
            res.json({ sucesso: false, mensagem: 'Erro ao salvar a foto do usuário' });
        else
            res.json({ sucesso: true, mensagem: 'Usuário salvo com sucesso' });
    });
});

app.delete('/usuario', function (req, res) {
    const fileName = req.body.fileName;
    const filePath = UPLOAD_PATH + fileName;

    fs.unlink(filePath, err => {
        if (err)
            res.json({ sucesso: false, mensagem: 'Erro ao apagar a foto do usuário' });
        else
            res.json({ sucesso: true, mensagem: 'Foto apagada com sucesso' });
    });
});

app.listen(3000, function () {
    console.log('O servidor está escutando a porta 3000');
});