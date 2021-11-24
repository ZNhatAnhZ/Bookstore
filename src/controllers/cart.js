const cart_items = require('../models/cart_items');
const orders = require('../models/orders');
const order_items = require('../models/order_items');
const payments = require('../models/payments');
const shipping = require('../models/shipping');
const products = require('../models/products');
const users = require('../models/users');

function getCurrentDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function getShippingDate() {
    let today = new Date();
    let dd = String(today.getDate() + 5).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

async function createOrder(id, totalAmount) {
    const allCartOfAnUser = await cart_items.findAll({ //find all cart items of an user
        where: {
            user_id: id
        }
    });

    const newOrder = await orders.create({ // create an order
        order_by: id,
        total_amount: totalAmount,
        status: 'complete',
        created_at: getCurrentDate()
    });

    const newPayment = await payments.create({ // create a payment
        payment_type: 'Tiền mặt',
        order_id: newOrder.id,
        amount: totalAmount,
        status: 'pending',
        created_at: newOrder.created_at
    });

    const newShipping = await shipping.create({ // create a shipping
        order_id: newOrder.id,
        status: 'pending',
        required_date: getShippingDate()
    });

    allCartOfAnUser.forEach((e) => { // create all order items
        const newOrderItem = order_items.create({
            order_id: newOrder.id,
            product_id: e.product_id,
            created_at: newOrder.created_at
        });
    })

    await cart_items.destroy({ // delete all cart item of this user
        where: {
            user_id: id
        }
    });
}

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

async function deleteCartItems(req, res) {
    let { id } = req.params;
    if (req.session.user_id != null && id == req.session.user_id) {
        const { cart_id } = req.body;
        if (cart_id) {
            await cart_items.destroy({
                where: {
                    id: cart_id
                }
            });
        } else {
            const { totalAmount } = req.body;
            createOrder(id, totalAmount);
        }

        res.redirect(`/cart/${id}`);
    } else {
        res.send({});
    }
}

module.exports = {
    getCartItemByUserId,
    renderCart,
    deleteCartItems
}