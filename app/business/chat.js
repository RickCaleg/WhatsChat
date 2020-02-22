var Chat = (function () {
    const _listaUsuarios = {};

    function AdicionarUsuario({ nome, foto, socketID }) {
        const idUsuario = _gerarIDUsuario();
        _listaUsuarios[idUsuario] = {
            'nome': nome,
            'foto': foto,
            'socketID': socketID
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
        return true;
    }
    function GetUsuario(idUsuario) {
        return _listaUsuarios[idUsuario] || null;
    }

    function ListarUsuarios() {
        return _listaUsuarios;
    }

    const _gerarIDUsuario = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }


    return {
        AdicionarUsuario,
        RemoverUsuario,
        AtualizarUsuario,
        GetUsuario,
        ListarUsuarios
    };
})();

module.exports = Chat;