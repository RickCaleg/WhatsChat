var Index = (function () {
    const idUsuario = localStorage.getItem('idUsuario');
    let usuario = null;
    let socketID = null;

    document.addEventListener('DOMContentLoaded', inicializar);

    function inicializar() {
        if (!idUsuario)
            return Deslogar();

        const socket = io.connect('http://localhost:3000');
        socket.on('connect', async () => {
            socketID = socket.id;
            Logar();
            GetListaUsuarios();
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
            return Deslogar();

        usuario = await Utility.invoke('POST', '/GetUsuario', { 'idUsuario': idUsuario });

        if (!usuario)
            return Deslogar();

        await Utility.invoke('POST', '/AtualizarUsuario', { 'idUsuario': idUsuario, 'socketID': socketID });

        document.getElementById('btnLogin').classList.add('hide');
        document.getElementById('btnLogout').classList.remove('hide');

        const userData = document.getElementById('user-data');
        userData.querySelector('.foto').style['background-image'] = `url(/files/fotosUsuarios/${usuario.foto})`;
        userData.querySelector('.nome').innerHTML = usuario.nome.split(' ')[0];
        userData.classList.remove('hide');
        document.getElementById('btnLogout').addEventListener('click', Deslogar);
    }

    async function GetListaUsuarios() {
        const listaUsuarios = await Utility.invoke('POST', '/ListarUsuarios', { 'idUsuario': idUsuario });
        const divListaUsuarios = document.getElementById('ListaUsuarios');

        console.log(listaUsuarios);

        divListaUsuarios.innerHTML = listaUsuarios.map(user => {
            return `
            <div class="item">
                <div class="foto" style="background-image: url(/files/fotosUsuarios/${user.foto});"></div>
                <div class="nome">${user.nome}</nome>
            </div>
            `;
        }).join('');
    }
})();