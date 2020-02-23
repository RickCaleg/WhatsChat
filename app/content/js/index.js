var Index = (function () {
    const idUsuario = localStorage.getItem('idUsuario');
    let usuario = null;
    let socketID = null;

    document.addEventListener('DOMContentLoaded', inicializar);

    function inicializar() {
        if (!idUsuario)
            Deslogar();

        const socket = io.connect('http://localhost:3000');
        socket.on('connect', async () => {
            socketID = socket.id;
            Logar();
        });
    }

    async function Deslogar() {
        if (idUsuario)
            await Utility.invoke('POST', '/Logout', { idUsuario: idUsuario });
        localStorage.removeItem('idUsuario');
        window.location.href = '/Usuario';
    }
    async function Logar() {
        if (!socketID)
            Deslogar();

        usuario = await Utility.invoke('POST', '/GetUsuario', { 'idUsuario': idUsuario });

        if (!usuario)
            Deslogar();

        await Utility.invoke('POST', '/AtualizarUsuario', { 'idUsuario': idUsuario, 'socketID': socketID });

        document.getElementById('btnLogin').classList.add('hide');
        document.getElementById('btnLogout').classList.remove('hide');

        const userData = document.getElementById('user-data');
        userData.querySelector('.foto').style['background-image'] = `url(/files/fotosUsuarios/${usuario.foto})`;
        userData.querySelector('.nome').innerHTML = usuario.nome.split(' ')[0];
        userData.classList.remove('hide');
        document.getElementById('btnLogout').addEventListener('click', Deslogar);
    }
})();