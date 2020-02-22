var Index = (function () {
    const idUsuario = localStorage.getItem('idUsuario');
    let usuario = null;

    document.addEventListener('DOMContentLoaded', inicializar);

    function inicializar() {
        if (!idUsuario)
            window.location.href = '/Usuario';

        const socket = io.connect('http://localhost:3000');
        socket.on('connect', async () => {
            await conectarUsuario(socket.id);
            console.table(usuario);
            Logar();
        });
    }

    async function conectarUsuario(socketID) {
        usuario = await Utility.invoke('POST', '/GetUsuario', {
            idUsuario: idUsuario
        });

        if (!usuario)
            window.location.href = '/Usuario';

        await Utility.invoke('POST', '/AtualizarUsuario', {
            idUsuario: idUsuario,
            socketID: socketID
        });
    }

    function Logar() {
        document.getElementById('btnLogin').classList.add('hide');
        document.getElementById('btnLogout').classList.remove('hide');
    }
})();