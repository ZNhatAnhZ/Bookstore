const cart_items = require('../models/cart_items');
const users = require('../models/users');


async function getCartItemByUserId(req, res) {
    if (req.query['userId'] != null) {
        const cartItems = await cart_items.findAll({
            where: {
                user_id: req.query.userId
            }
        });
        const data = JSON.stringify(cartItems, null, 2)
        res.send(data);
    } else {
        res.send({});
    }
}

async function renderCart(req, res) {
    let username = null;
    let { id } = req.params;
    if (req.session.user_id != null && id == req.session.user_id) {
        loginCheck = req.session.user_id;
        const user = await users.findOne({
            where: {
                id: req.session.user_id
            },
            attributes: ['user_name']
        });
        username = user.dataValues.user_name;
        res.render('cart.ejs', { username, loginCheck });
        res.end();
    } else {
        // res.send('unable to connect');
    }
}

module.exports = {
    getCartItemByUserId,
    renderCart
}