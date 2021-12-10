const cart_items = require('../models/cart_items');
const orders = require('../models/orders');
const order_items = require('../models/order_items');
const payments = require('../models/payments');
const shipping = require('../models/shipping');
const users = require('../models/users');
const products = require('../models/products');
const product_review = require('../models/product_review');
const category = require('../models/category');
const { Op } = require("sequelize");


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

function convertStringToArray(string) {
    let arrayOfData = [];
    let stringNumber = '';
    for (let i = 0; i < string.length; i++) {
        if (string[i] >= '0' && string[i] <= '9') {
            stringNumber += string[i];
        } else {
            if (!isNaN(parseInt(stringNumber))) {
                arrayOfData.push(parseInt(stringNumber));
            }
            stringNumber = '';
        }
    }
    return arrayOfData;
}

async function findProduct(req, res) {
    if (req.query['title'] != null) {
        const Products = await products.findAll({
            where: {
                product_name: {
                    [Op.substring]: req.query.title
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
    } else if (req.query['category'] != null) {
        const categoryId = await category.findOne({
            where: {
                category_name: req.query.category
            }
        });

        const Products = await products.findAll({
            where: {
                product_category: categoryId.id
            }
        });
        const data = JSON.stringify(Products, null, 2);
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

async function buyProduct(req, res) {
    let { id } = req.params;
    const { quantity } = req.body;
    if (req.session.user_id != null) {
        const product = await products.findByPk(id);
        const newOrder = await orders.create({ // create an order
            order_by: req.session.user_id,
            total_amount: product.product_price * quantity,
            status: 'complete',
            created_at: getCurrentDate()
        });

        const newPayment = await payments.create({ // create a payment
            payment_type: 'Tiền mặt',
            order_id: newOrder.id,
            amount: product.product_price * quantity,
            status: 'pending',
            created_at: newOrder.created_at
        });

        const newShipping = await shipping.create({ // create a shipping
            order_id: newOrder.id,
            status: 'pending',
            required_date: getShippingDate()
        });

        const newOrderItem = order_items.create({
            order_id: newOrder.id,
            product_id: product.id,
            created_at: newOrder.created_at
        });

        res.redirect(`/products/${id}`);
    } else {
        res.send({});
    }
}

async function addComment(req, res) {
    let { id } = req.params;
    const { comment, rating } = req.body;
    if (req.session.user_id != null) {
        const newComment = product_review.create({
            review_product_id: id,
            review_by: req.session.user_id,
            rating: rating,
            comment: comment,
            review_date: getCurrentDate()
        });

        res.redirect(`/products/${id}`);
    } else {
        res.send({});
    }
}

async function loadComment(req, res) {
    let { id } = req.params;

    const comment = await product_review.findAll({
        where: {
            review_product_id: id
        }
    });
    const data = JSON.stringify(comment, null, 2)
    res.send(data);
}

async function getAllProductbyCondition(req, res) {
    const { order } = req.params;
    if (order == 'new') {
        const Products = await products.findAll({
            order: [['id', 'DESC']]
        });
        const data = JSON.stringify(Products, null, 2);
        res.send(data);
    } else if (order == 'sale') {
        const Products = await products.findAll({
            order: [['quantity', 'ASC']]
        });
        const data = JSON.stringify(Products, null, 2);
        res.send(data);
    } else if (order == 'asc') {
        const Products = await products.findAll({
            order: [['product_price', 'ASC']]
        });
        const data = JSON.stringify(Products, null, 2);
        res.send(data);
    } else if (order == 'desc') {
        const Products = await products.findAll({
            order: [['product_price', 'DESC']]
        });
        const data = JSON.stringify(Products, null, 2);
        res.send(data);
    }

}

async function getRecommendedProduct(req, res) {
    const { id } = req.params;
    let allRatingArray = [];

    const allRating = await product_review.findAll({
        attributes: ['review_by', 'review_product_id', 'rating']
    })

    allRating.forEach((element) => {
        let tempArray = [];
        tempArray.push(element.dataValues.review_by, element.dataValues.review_product_id, element.dataValues.rating);
        allRatingArray.push(tempArray);
    })

    for (let i = 0; i < allRatingArray.length; i++) {
        let count = 1;
        let sum = allRatingArray[i][2];
        for (let j = i + 1; j < allRatingArray.length; j++) {
            if (allRatingArray[i][0] === allRatingArray[j][0] && allRatingArray[i][1] === allRatingArray[j][1]) {
                sum = sum + allRatingArray[j][2];
                count++;
                allRatingArray.splice(j, 1);
                j--;
            }
        }
        allRatingArray[i][2] = sum / count;
    }

    const spawn = require('child_process').spawn;
    const pythonProcess = spawn('C:/Users/NhatAnh/AppData/Local/Programs/Python/Python39/python.exe', ['C:/Users/NhatAnh/Desktop/ProjectWeb2/src/controllers/recommender.py', JSON.stringify(allRatingArray), id]);
    pythonProcess.stdout.on('data', async (data) => {
        let recommendedProductsData = [];
        const stringOfData = data.toString(); //convert the data from byte to string
        const recommendedProductsId = convertStringToArray(stringOfData); // convert string to array for accessing product id
        await Promise.all(recommendedProductsId.map(async (e) => {
            const Product = await products.findByPk(e);
            recommendedProductsData.push(Product);
        }))
        console.log(stringOfData);
        res.send(recommendedProductsData);
    });
    pythonProcess.on('error', (err) => {
        console.log(err)
    });
}

module.exports = {
    findProduct,
    renderProduct,
    addCartItem,
    buyProduct,
    addComment,
    loadComment,
    getAllProductbyCondition,
    getRecommendedProduct
}


