const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const usersModel = require('./src/models/users');

const products = require('./src/routes/product');
const categories = require('./src/routes/category');
const users = require('./src/routes/user');
const login = require('./src/routes/login');
const logout = require('./src/routes/logout');
const register = require('./src/routes/register');
const personalshop = require('./src/routes/personalshop');


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
        const user = await usersModel.findOne({
            where: {
                id: req.session.user_id
            },
            attributes: ['user_name']
        });
        username = user.dataValues.user_name;
    }
    res.render('index.ejs', { loginCheck, username });
})

//routes
app.use('/products', products);
app.use('/categories', categories);
app.use('/user', users);
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);
app.use('/personalshop', personalshop);

