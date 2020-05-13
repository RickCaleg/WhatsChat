const app = require('./app/app');

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('O servidor está escutando a porta 3000');
});