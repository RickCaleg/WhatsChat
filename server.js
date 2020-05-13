const app = require('./app/app');

//HTTPS
app.use(function (req, res, next) {
    if ((req.get('X-Forwarded-Proto') !== 'https')) {
        res.redirect('https://' + req.get('Host') + req.url);
    } else
        next();
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log('O servidor está escutando a porta 3000');
});