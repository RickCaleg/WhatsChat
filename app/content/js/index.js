var Index = (function () {
    const idUsuario = localStorage.getItem('idUsuario');
    let usuario = null;
    let socketID = null;

    document.addEventListener('DOMContentLoaded', inicializar);

    function inicializar() {
        if (!idUsuario)
            return Deslogar();

        const socket = io.connect('https://whatschat.richardson.eti.br');
        socket.on('connect', async () => {
            socketID = socket.id;
            Logar();
            ConfigurarInputMensagem();
            GetListaUsuariosOnline();

            socket.on('refresh-users', GetListaUsuariosOnline);
            socket.on('new-message', mensagem => NovaMensagem(mensagem));
            socket.on('new-warning', aviso => NovoAviso(aviso));
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

    async function GetListaUsuariosOnline() {
        const listaUsuarios = await Utility.invoke('POST', '/ListarUsuariosOnline', { 'idUsuario': idUsuario });
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
    function NovaMensagem(mensagem) {
        const divListaMensagens = document.getElementById('ListaMensagens');

        divListaMensagens.innerHTML = divListaMensagens.innerHTML + `
            <div class="mensagem ${mensagem.idUsuario == idUsuario ? `minha` : ``}">
                <div class="nome">${mensagem.nome}</div>
                <div class="conteudo">${mensagem.mensagem}</div>
            </div>
        `;

        divListaMensagens.scroll(0, divListaMensagens.scrollHeight);
    }
    function NovoAviso(aviso) {
        const divListaMensagens = document.getElementById('ListaMensagens');

        divListaMensagens.innerHTML = divListaMensagens.innerHTML + `
            <div class="aviso">${aviso}</div>
        `;
    }


    function ConfigurarInputMensagem() {
        const txtMensagem = document.getElementById('txtMensagem');
        const btnEnviar = document.getElementById('btnEnviar');

        btnEnviar.addEventListener('click', EnviarMensagem);
        txtMensagem.addEventListener('keydown', function (e) { if (e.keyCode === 13) EnviarMensagem(); });
    }

    function EnviarMensagem() {
        const txtMensagem = document.getElementById('txtMensagem');

        if (txtMensagem.value.length <= 0)
            return;

        Utility.invoke('POST', '/AdicionarMensagem', { idUsuario: idUsuario, mensagem: txtMensagem.value, nome: usuario.nome }).then(result => {
            if (result.sucesso === true)
                txtMensagem.value = '';
        });
    }
})();