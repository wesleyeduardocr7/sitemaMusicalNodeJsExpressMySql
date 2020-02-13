
let express = require('express');
let consign = require('consign');  
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');

let app = express();

app.use(express.static('./app/public'));

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(bodyParser.urlencoded({extended: true} ));
app.use(expressValidator() );

consign({cwd:'app'})
   .include('rotas')
   .then('infra')
   .then('repositorio')
   .into(app);

module.exports = function() {
    return app;
}

 