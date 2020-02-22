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

            document.getElementById('btnLogout').addEventListener('click', Deslogar);
        });
    }

    async function conectarUsuario(socketID) {
        usuario = await Utility.invoke('POST', '/GetUsuario', {
            idUsuario: idUsuario
        });

        if (!usuario) {
            localStorage.removeItem('idUsuario');
            window.location.href = '/Usuario';
        }

        await Utility.invoke('POST', '/AtualizarUsuario', {
            idUsuario: idUsuario,
            socketID: socketID
        });
    }

    function Logar() {
        document.getElementById('btnLogin').classList.add('hide');
        document.getElementById('btnLogout').classList.remove('hide');
    }

    async function Deslogar() {
        const result = await Utility.invoke('POST', '/Logout', { idUsuario: idUsuario });
        if (result.sucesso === true) {
            localStorage.removeItem('idUsuario');
            window.location.href = '/Usuario';
        }
    }
})();