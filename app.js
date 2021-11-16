const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const products = require('./src/models/products');
const shop = require('./src/models/shop');
const categories = require('./src/models/category');
const users = require('./src/models/users');
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

app.get('/product/:id', (req, res) => {
    res.render('productdetail.ejs');
})

app.get('/products', async (req, res) => {
    if (req.query['title'] != null) {
        const Products = await products.findAll({
            where: {
                product_name: {
                    [Op.like]: req.query.title
                }
            }
        });
        const data = JSON.stringify(Products, null, 2)
        res.send(data);
    } else if (req.query['id'] != null) {
        const Products = await products.findByPk(req.query.id);
        res.send(Products);
    } else {
        const allProducts = await products.findAll();
        const data = JSON.stringify(allProducts, null, 2)
        res.send(data);
    }
})

app.get('/categories', async (req, res) => {
    if (req.query['id'] == null) {
        const allCategories = await categories.findAll();
        const data = JSON.stringify(allCategories, null, 2)
        res.send(data);
    } else {
        const Categories = await categories.findAll({
            where: {
                id: req.query.id
            }
        });
        const data = JSON.stringify(Categories, null, 2)
        res.send(data);
    }
})

app.get('/user', async (req, res) => {
    if (req.query['id'] != null) {
        const User = await users.findByPk(req.query.id);
        res.send(User);
    } else {
        const Users = await users.findAll();
        const data = JSON.stringify(Users, null, 2)
        res.send(data);
    }
})

app.get('/productdetail/:id', async (req, res) => {
    const { id } = req.params;
    const Product = await products.findByPk(id);
    const Provider = await shop.findOne({ where: { shop_owner_id: Product.provider_id } });
    const User = await users.findByPk(Provider.id);
    const productDetail = Product.dataValues;
    res.send({ productDetail, User });
})




