const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const products = require('./src/models/products');
const shop = require('./src/models/shop');
const categories = require('./src/models/category');
const users = require('./src/models/users');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt');
const session = require('express-session');

function isLoggedin(req, res, next) {
    if (!req.session.user_id) {
        res.redirect(`/login?origin=${req.originalUrl}`);
    }
    next();
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'notagoodsecret' }))

require('./src/database/connection');


app.listen(3000, () => {
    console.log('listening on 3000');
})

// render page

app.get('/', async (req, res) => {
    let loginCheck = null;
    let username = null;
    if (req.session.user_id) {
        loginCheck = req.session.user_id;
        const user = await users.findOne({
            where: {
                id: req.session.user_id
            },
            attributes: ['user_name']
        });
        username = user.dataValues.user_name;
    }
    res.render('index.ejs', { loginCheck, username });
})

app.get('/product/:id', async (req, res) => {
    let loginCheck = null;
    let username = null;
    if (req.session.user_id) {
        loginCheck = req.session.user_id;
        const user = await users.findOne({
            where: {
                id: req.session.user_id
            },
            attributes: ['user_name']
        });
        console.log(user);
        username = user.dataValues.user_name;
    }
    res.render('productdetail.ejs', { loginCheck, username });
})

app.get('/login', (req, res) => {
    if (req.query.origin)
        req.session.returnTo = req.query.origin
    else
        req.session.returnTo = req.header('Referer')

    res.render('login.ejs');
})

app.get('/register', (req, res) => {
    if (req.query.origin)
        req.session.returnTo = req.query.origin
    else
        req.session.returnTo = req.header('Referer')
    res.render('register.ejs');
})

app.get('/user/:id', isLoggedin, async (req, res) => {
    let username = null;
    let { id } = req.params;
    if (req.session.user_id && id == req.session.user_id) {
        loginCheck = req.session.user_id;
        const user = await users.findOne({
            where: {
                id: req.session.user_id
            },
            attributes: ['user_name']
        });
        username = user.dataValues.user_name;
        res.render('user-info.ejs', { username });
        res.end();
    } else {
        res.send('unable to connect');
    }
})

// -------------------------------

// get product category user

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
    if (req.query['id'] != null) {
        const Categories = await categories.findAll({
            where: {
                id: req.query.id
            }
        });
        const data = JSON.stringify(Categories, null, 2)
        res.send(data);
    } else {
        const allCategories = await categories.findAll();
        const data = JSON.stringify(allCategories, null, 2)
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

// -------------------------------


// register and login and logout

app.post('/register', async (req, res) => {
    let returnTo = '/';
    const { password, username } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = await users.findOne({
        where: {
            user_name: username
        }
    });
    if (user == null) {
        const newUser = await users.create({
            user_name: username,
            user_type: 'user',
            password: hash
        })
        req.session.user_id = newUser.dataValues.id;
        if (req.session.returnTo) {
            returnTo = req.session.returnTo
            delete req.session.returnTo
        }
        res.redirect(returnTo);
    } else {
        res.send('already existed user');
    }

})

app.post('/login', async (req, res) => {
    let returnTo = '/';
    const { password, username } = req.body;
    const user = await users.findOne({
        where: {
            user_name: username
        }
    });
    if (user != null) {
        const validPassword = await bcrypt.compare(password, user.dataValues.password);
        if (validPassword) {
            req.session.user_id = user.dataValues.id;
            if (req.session.returnTo) {
                returnTo = req.session.returnTo
                delete req.session.returnTo
            }
            res.redirect(returnTo);
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})

// -------------------------------





