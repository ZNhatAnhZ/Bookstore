const products = require('../models/products');
const users = require('../models/users');
const cart_items = require('../models/cart_items');
const { Op } = require("sequelize");

async function findProduct(req, res) {
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
    } else if (req.query['provider'] != null) {
        const Products = await products.findAll({
            where: {
                provider_id: req.query.provider
            }
        });
        const data = JSON.stringify(Products, null, 2)
        res.send(data);
    } else {
        const allProducts = await products.findAll();
        const data = JSON.stringify(allProducts, null, 2)
        res.send(data);
    }
}

async function renderProduct(req, res) {
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
}

async function addCartItem(req, res) {
    let { id } = req.params;
    if (req.session.user_id != null) {
        const userData = await users.findOne({
            where: {
                id: req.session.user_id
            }
        })
        const productData = await products.findOne({
            where: {
                id: id
            }
        })
        const { quantity } = req.body;

        if (userData && productData) {
            const newCartItems = await cart_items.create({
                user_id: req.session.user_id,
                product_id: id,
                quantity: quantity
            });
            res.redirect(`/products/${id}`);
        } else {
            // res.redirect(`/products/${id}`);
        }
    } else {
        // res.redirect(`/products/${id}`);
    }
}

module.exports = {
    findProduct,
    renderProduct,
    addCartItem
}


