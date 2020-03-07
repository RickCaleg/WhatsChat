var Chat = (function () {
    const _listaUsuarios = {};

    function AdicionarUsuario({ nome, foto, socketID }) {
        const idUsuario = _gerarIDUsuario();
        _listaUsuarios[idUsuario] = {
            'idUsuario': idUsuario,
            'nome': nome,
            'foto': foto,
            'socketID': socketID,
            'online': 0
        };
        return idUsuario;
    }
    function RemoverUsuario(idUsuario) {
        if (_listaUsuarios[idUsuario])
            delete _listaUsuarios[idUsuario];
    }
    function AtualizarUsuario(idUsuario, socketID) {
        if (!_listaUsuarios[idUsuario])
            return false;

        _listaUsuarios[idUsuario].socketID = socketID;

        if (_listaUsuarios[idUsuario].online === 0) {
            _listaUsuarios[idUsuario].online = 1;
            global.io.emit('new-warning', `${_listaUsuarios[idUsuario].nome} entrou na sala`);
            global.io.emit('refresh-users');
        }
        return true;
    }
    function GetUsuario(idUsuario) {
        return _listaUsuarios[idUsuario] || null;
    }
    function GetUsuarioBySocketId(socketID) {
        const listaUsuarios = Object.entries(_listaUsuarios);
        let retorno = null;
        listaUsuarios.forEach(element => {
            const usuario = element[1];
            if (usuario.socketID === socketID)
                retorno = usuario;
        });
        return retorno;
    }
    function ListarUsuarios(idUsuario) {
        const retorno = [];
        const listaUsuarios = Object.entries(_listaUsuarios);

        for (let i = 0; i < listaUsuarios.length; i++) {
            if (listaUsuarios[i][1].idUsuario !== idUsuario)
                retorno.push(listaUsuarios[i][1]);
        }
        return retorno;
    }
    const _gerarIDUsuario = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function AdicionarMensagem(idUsuario, mensagem, nome) {
        global.io.emit('new-message', {
            'idUsuario': idUsuario,
            'nome': nome,
            'mensagem': mensagem,
            'data': new Date(),
            'online': 1
        });
    }
    function ListarMensagens(idUltimaMensagem) {
        return _listaMensagens.filter(msg => msg.idMensagem > idUltimaMensagem);
    }

    function UsuarioDesconectado(idUsuario) {
        const usuario = _listaUsuarios[idUsuario];

        if (!usuario)
            return false;

        _listaUsuarios[idUsuario].online = 0;
        global.io.emit('new-warning', `${usuario.nome} saiu da sala`);
        global.io.emit('refresh-users');
        return true;
    }

    return {
        AdicionarUsuario,
        RemoverUsuario,
        AtualizarUsuario,
        GetUsuario,
        GetUsuarioBySocketId,
        ListarUsuarios,
        AdicionarMensagem,
        ListarMensagens,
        UsuarioDesconectado
    };
})();

module.exports = Chat;