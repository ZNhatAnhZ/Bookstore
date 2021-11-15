const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1892001',
    database: 'e-commerce'
});

db.connect((err) => {
    if (err) {
        throw err;
    }

    console.log('MySQL Connected...');
})

app.listen(3000, () => {
    console.log('listening on 3000');
})

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/products', (req, res) => {
    db.query("SELECT * FROM products", function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
})

app.get('/products/:title', (req, res) => {
    const { title } = req.params;
    console.log(req.params);
    db.query(`SELECT * FROM products where product_name like '${title}'`, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
    });
})