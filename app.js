const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sistemamusical'
});

connection.connect(function (error) {
    if (!!error) console.log(error);
    else console.log('Database Connected!');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static("design"));

app.get('/', (req, res) => {

    res.render('index');

});

/*app.get('/', (req, res) => {
    let sql = "SELECT * FROM users";
    let query = connection.query(sql, (err, rows) => {
        if (err) throw err;
        res.render('user_index', {
            title: 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            users: rows
        });
    });
});
*/

app.get('/vaiParaMusica', (req, res) => {
    res.render('musica');
});

app.post('/save', (req, res) => {
    let data = { nome: req.body.nome, duracao: req.body.duracao, artistas: req.body.artistas };
    let sql = "INSERT INTO musica SET ?";
    let query = connection.query(sql, data, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.get('/edit/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from users where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.render('user_edit', {
            title: 'Editar',
            user: result[0]
        });
    });
});


app.post('/update', (req, res) => {
    const userId = req.body.id;
    let sql = "update users SET nome='" + req.body.nome + "',  duracao='" + req.body.duracao + "',  artistas='" + req.body.artistas + "' where id =" + userId;
    let query = connection.query(sql, (err, results) => {
        if (err) throw err;
        res.redirect('/');
    });
});


app.get('/delete/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `DELETE from users where id = ${userId}`;
    let query = connection.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log('Server is running at port 3000');
})