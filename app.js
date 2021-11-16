const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const products = require('./src/models/products');
const categories = require('./src/models/category');
const { Op } = require("sequelize");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('./src/database/connection');


app.listen(3000, () => {
    console.log('listening on 3000');
})

app.get('/', (req, res) => {
    res.render('index.ejs');
})

app.get('/products', async (req, res) => {
    const allProducts = await products.findAll();
    const data = JSON.stringify(allProducts, null, 2)
    res.send(data);
})

app.get('/products/:title', async (req, res) => {
    const { title } = req.params;
    const Products = await products.findAll({
        where: {
            product_name: {
                [Op.like]: title
            }
        }
    });
    const data = JSON.stringify(Products, null, 2)
    res.send(data);
})

app.get('/productdetail/:id', async (req, res) => {
    const { id } = req.params;
    const Product = await products.findAll({
        where: {
            id: id
        }
    });
    res.render('productdetail.ejs', { Product });
})

app.get('/categories', async (req, res) => {
    const allCategories = await categories.findAll();
    const data = JSON.stringify(allCategories, null, 2)
    res.send(data);
})

app.get('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const Categories = await categories.findAll({
        where: {
            id: id
        }
    });

    const data = JSON.stringify(Categories, null, 2)
    res.send(data);
})


