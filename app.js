const express = require('express');
const app = express();
const mysql = require('mysql');
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use('/styles', express.static(path.join(__dirname, '/styles')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1892001'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
})

// db.query('select * from e-commerce.product', (err, rows, fields) => {
//     if (err) throw err;

//     console.log(`${rows[0]}`);
// })

app.listen(3000, () => {
    console.log('listening on 3000');
})

app.get('/', (req, res) => {
    res.render('index.ejs');
})