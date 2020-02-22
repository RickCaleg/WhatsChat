var Usuario = (function () {
    const container = document.querySelector('#Login');

    const campos = {
        txtFotoUsuario: container.querySelector('#txtFotoUsuario'),
        txtNome: container.querySelector('#txtNome'),
        btnEntrar: container.querySelector('#btnEntrar')
    };

    document.addEventListener('DOMContentLoaded', inicializar);

    function inicializar() {
        FotoUsuario.inicializar();

        campos.btnEntrar.addEventListener('click', async (event) => {
            event.preventDefault();
            const valido = validar();

            if (!valido)
                return;

            const socket = io.connect('http://localhost:3000');
            socket.on('connect', async () => {
                const data = new FormData(container);
                data.append('socketID', socket.id);

                const result = await Utility.invokeForm('POST', '/Usuario', data);
                if (result.sucesso === true)
                    window.location.href = '/';
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



    var Utility = (function () {
        function readURL(input) {
            return new Promise((resolve, reject) => {
                if (!input.files || !input.files[0])
                    reject();
                var reader = new FileReader();

                reader.onload = e => {
                    resolve(e.target.result);
                };

                reader.readAsDataURL(input.files[0]);
            });
        }
        function invoke(type, url, data) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open(type, url, true);
                xhr.setRequestHeader('content-type', 'application/json');
                xhr.onload = function (event) {
                    if (xhr.status != 200)
                        resolve({ sucesso: false, mensagem: 'Erro ao salvar usuario' });
                    resolve(JSON.parse(event.target.response));
                }
                xhr.send(data);
            });
        }
        function invokeForm(type, url, data) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open(type, url, true);
                xhr.onload = function (event) {
                    if (xhr.status != 200)
                        resolve({ sucesso: false, mensagem: 'Erro ao salvar usuario' });
                    resolve(JSON.parse(event.target.response));
                }
                xhr.send(data);
            });
        }
        function serialize(form) {

            // Setup our serialized data
            var serialized = [];

            // Loop through each field in the form
            for (var i = 0; i < form.elements.length; i++) {

                var field = form.elements[i];

                // Don't serialize fields without a name, submits, buttons, file and reset inputs, and disabled fields
                if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;

                // If a multi-select, get all selections
                if (field.type === 'select-multiple') {
                    for (var n = 0; n < field.options.length; n++) {
                        if (!field.options[n].selected) continue;
                        serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
                    }
                }

                // Convert field data to a query string
                else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                    serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                }
            }
            return serialized.join('&');
        };

        return {
            readURL,
            invoke,
            invokeForm,
            serialize
        }
    })();




    // const form = document.querySelector('#FormularioUsuario');
    // const fileUpload = form.querySelector('#fileUpload');
    // const fotoUsuario = form.querySelector('#fotoUsuario');

    // fotoUsuario.addEventListener('click', () => fileUpload.click());
    // fileUpload.addEventListener('change', async function () {
    //     const fileSrc = await readURL(this);

    //     fotoUsuario.style.backgroundImage = `url(${fileSrc})`;
    // });



    // form.addEventListener('submit', async function (event) {
    //     event.preventDefault();

    //     const result = await invokeForm('POST', '/Usuario', new FormData(form));
    //     console.log(result);
    // });

    // btnExcluir.addEventListener('click', async function () {
    //     const fileName = fileUpload.files[0].name;

    //     const data = {
    //         fileName: fileName
    //     };
    //     const result = await invoke('DELETE', '/Usuario', JSON.stringify(data));
    //     console.log(result);

    //     if (result.sucesso === true) {
    //         fileUpload.value = '';
    //         fotoUsuario.style.backgroundImage = 'none';
    //     }
    // });



    return {
        FotoUsuario
    }
})();