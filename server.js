const app = require('./app/app');

//HTTPS
// app.use(function(req, res, next) {
//     // The 'x-forwarded-proto' check is for Heroku
//     if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
//         return res.redirect('https://' + req.get('host') + req.url);
//     }
//     next();
// });

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('O servidor está escutando a porta 3000');
});