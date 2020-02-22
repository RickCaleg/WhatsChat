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
            xhr.send(JSON.stringify(data));
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