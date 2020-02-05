var Usuario = (function () {
    const form = document.querySelector('#FormularioUsuario');
    const txtFotoUsuario = form.querySelector('#txtFotoUsuario');
    const fileUpload = form.querySelector('#fileUpload');
    const btnExcluir = document.querySelector('#btnExcluir');

    fileUpload.addEventListener('change', function () {
        const fileName = this.files[0].name;

        txtFotoUsuario.value = fileName;
    });

    txtFotoUsuario.addEventListener('click', () => fileUpload.click());
    txtFotoUsuario.addEventListener('keydown', event => event.preventDefault());

    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const result = await invokeForm('POST', '/Usuario', new FormData(form));
        console.log(result);
    });

    btnExcluir.addEventListener('click', async function () {
        const fileName = fileUpload.files[0].name;

        console.log('Excluir', fileName);

        const data = {
            fileName: fileName
        };
        const result = await invoke('DELETE', '/Usuario', JSON.stringify(data));
        txtFotoUsuario.value = '';
        console.log(result);
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