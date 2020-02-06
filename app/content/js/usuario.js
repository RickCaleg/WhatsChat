var Usuario = (function () {
    const form = document.querySelector('#FormularioUsuario');
    const fileUpload = form.querySelector('#fileUpload');
    const fotoUsuario = form.querySelector('#fotoUsuario');
    const btnExcluir = document.querySelector('#btnExcluir');

    fotoUsuario.addEventListener('click', () => fileUpload.click());
    fileUpload.addEventListener('change', async function () {
        const fileSrc = await readURL(this);

        fotoUsuario.style.backgroundImage = `url(${fileSrc})`;
    });

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

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const result = await invokeForm('POST', '/Usuario', new FormData(form));
        console.log(result);
    });

    btnExcluir.addEventListener('click', async function () {
        const fileName = fileUpload.files[0].name;

        const data = {
            fileName: fileName
        };
        const result = await invoke('DELETE', '/Usuario', JSON.stringify(data));
        console.log(result);

        if (result.sucesso === true) {
            fileUpload.value = '';
            fotoUsuario.style.backgroundImage = 'none';
        }
    });


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
})();