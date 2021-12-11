const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const { spawn } = require('child_process');

const usersModel = require('./src/models/users');

const products = require('./src/routes/product');
const categories = require('./src/routes/category');
const users = require('./src/routes/user');
const login = require('./src/routes/login');
const logout = require('./src/routes/logout');
const register = require('./src/routes/register');
const personalshop = require('./src/routes/personalshop');
const cart = require('./src/routes/cart');
const productReviews = require('./src/routes/productReviews');


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
app.use('/cart', cart);
app.use('/productReviews', productReviews);

// function randomIntFromInterval(min, max) { // min and max included
//     return Math.floor(Math.random() * (max - min + 1) + min)
// };

// const product_review = require('./src/models/product_review');

// async function add() {
//     for (let i = 0; i < 10; i++) {
//         const review_by = 31;
//         const review_product_id = randomIntFromInterval(0, 110);
//         const rating = randomIntFromInterval(0, 5);
//         let comment = "";
//         if (rating >= 4) {
//             comment = 'đây là 1 cuốn sách hay';
//         } else if (rating === 3) {
//             comment = 'sách bình thường';
//         } else {
//             comment = 'sách không hay';
//         }
//         const new_product_review = await product_review.create({
//             review_product_id: review_product_id,
//             review_by: review_by,
//             rating: rating,
//             comment: comment,
//             review_date: '2021-11-24'
//         });
//     }
// }

// add();







