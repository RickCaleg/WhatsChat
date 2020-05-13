var Usuario = (function () {
    const container = document.querySelector('#Login');

    const campos = {
        txtFotoUsuario: container.querySelector('#txtFotoUsuario'),
        txtNome: container.querySelector('#txtNome'),
        btnEntrar: container.querySelector('#btnEntrar')
    };

    document.addEventListener('DOMContentLoaded', inicializar);

    function inicializar() {
        if (localStorage.getItem('idUsuario'))
            window.location.href = '/';

        FotoUsuario.inicializar();

        campos.btnEntrar.addEventListener('click', async (event) => {
            event.preventDefault();
            const valido = validar();

            if (!valido)
                return;

            const socket = io.connect('https://whatschat.richardson.eti.br');
            socket.on('connect', async () => {
                const data = new FormData(container);
                data.append('socketID', socket.id);

                const result = await Utility.invokeForm('POST', '/Usuario', data);

                if (result.sucesso === true) {
                    localStorage.setItem('idUsuario', result.idUsuario);
                    window.location.href = '/';
                }
            });
        });
    }

    function validar() {
        let valido = true;

        if (!FotoUsuario.validar()) {
            valido = false;
        }

        if (!campos.txtNome.value) {
            campos.txtNome.classList.add('error');
            valido = false;
        }

        return valido;
    }

    var FotoUsuario = (function () {
        const fotoUsuario = container.querySelector('#fotoUsuario');
        const fileUpload = container.querySelector('#file_fotoUsuario');

        function inicializar() {
            fotoUsuario.addEventListener('click', function () {
                fileUpload.click();
            });

            fileUpload.addEventListener('change', async function () {
                const fileSrc = await (Utility.readURL(this));

                fotoUsuario.style.backgroundImage = `url(${fileSrc})`;
                campos.txtFotoUsuario.value = this.files[0].name;
                validar();
            });
        }

        function validar() {
            if (!campos.txtFotoUsuario.value) {
                fotoUsuario.classList.add('error');
                return false;
            } else {
                fotoUsuario.classList.remove('error');
                return true;
            }
        }

        return {
            inicializar,
            validar
        };
    })();

})();