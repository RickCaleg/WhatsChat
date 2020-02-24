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
            ConfigurarInputMensagem();
            GetListaUsuarios();
            GetListaMensagens();

            socket.on('refresh-users', GetListaUsuarios);
            socket.on('refresh-messages', GetListaMensagens);
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

        if (listaUsuarios.length > 0)
            divListaUsuarios.innerHTML = listaUsuarios.map(user => `
                <div class="item">
                    <div class="foto" style="background-image: url(/files/fotosUsuarios/${user.foto});"></div>
                    <div class="nome">${user.nome}</nome>
                </div>
                `).join('');
        else
            divListaUsuarios.innerHTML = '<div class="item">Ninguém está online</div>';
    }
    async function GetListaMensagens() {
        const listaMensagens = await Utility.invoke('POST', '/ListarMensagens');
        const divListaMensagens = document.getElementById('ListaMensagens');

        if (listaMensagens.length > 0)
            divListaMensagens.innerHTML = listaMensagens.map(msg => `
                <div class="mensagem ${msg.idUsuario == idUsuario ? `minha` : `${console.log(msg)}`}">
                    <div class="nome">${msg.nome}</div>
                    <div class="conteudo">${msg.mensagem}</div>
                </div>
                `).join(' ');
    }

    function ConfigurarInputMensagem() {
        const txtMensagem = document.getElementById('txtMensagem');
        const btnEnviar = document.getElementById('btnEnviar');

        btnEnviar.addEventListener('click', EnviarMensagem);
        txtMensagem.addEventListener('keydown', function (e) { if (e.keyCode === 13) EnviarMensagem(); });
    }

    function EnviarMensagem() {
        const txtMensagem = document.getElementById('txtMensagem');
        const btnEnviar = document.getElementById('btnEnviar');

        if (txtMensagem.value.length <= 0)
            return;

        Utility.invoke('POST', '/AdicionarMensagem', { idUsuario: idUsuario, mensagem: txtMensagem.value, nome: usuario.nome }).then(result => {
            if (result.sucesso === true)
                txtMensagem.value = '';
        });
    }
})();