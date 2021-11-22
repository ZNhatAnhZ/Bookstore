const users = require('../models/users');
const products = require('../models/products');
const category = require('../models/category');

async function renderShop(req, res) {
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
        res.render('personalshop.ejs', { username, loginCheck });
        res.end();
    } else {
        // res.send('unable to connect');
    }
}

async function userSendProductData(req, res) {
    let { id } = req.params;
    if (req.session.user_id != null && id == req.session.user_id) {
        const { product_selector, product_category, product_name, product_price, product_quantity, product_img, product_description, provider_id } = req.body;

        if (product_selector === 'none' && product_category && product_name && product_price && product_quantity && product_img && product_description && provider_id) {
            const categoryData = await category.findOne({
                where: {
                    category_name: product_category
                }
            })

            if (!categoryData) {
                const newCategory = await category.create({
                    category_name: product_category
                })

                const newProduct = await products.create({
                    product_category: newCategory.id,
                    product_name: product_name,
                    product_price: product_price,
                    quantity: product_quantity,
                    product_details: product_description,
                    product_photo: product_img,
                    provider_id: provider_id
                });
            } else {
                const newProduct = await products.create({
                    product_category: categoryData.id,
                    product_name: product_name,
                    product_price: product_price,
                    quantity: product_quantity,
                    product_details: product_description,
                    product_photo: product_img,
                    provider_id: provider_id
                });
            }
        } else if (product_selector !== 'none' && product_category && product_name && product_price && product_quantity && product_img && product_description && provider_id) {
            const categoryData = await category.findOne({
                where: {
                    category_name: product_category
                }
            })
            if (!categoryData) {
                const newCategory = await category.create({
                    category_name: product_category
                })
                await products.update({
                    product_category: newCategory.id,
                    product_name: product_name,
                    product_price: product_price,
                    quantity: product_quantity,
                    product_details: product_description,
                    product_photo: product_img,
                    provider_id: provider_id
                }, {
                    where: {
                        id: product_selector
                    }
                });
            } else {
                await products.update({
                    product_category: categoryData.id,
                    product_name: product_name,
                    product_price: product_price,
                    quantity: product_quantity,
                    product_details: product_description,
                    product_photo: product_img,
                    provider_id: provider_id
                }, {
                    where: {
                        id: product_selector
                    }
                });
            }
        } else {
            await products.destroy({
                where: {
                    id: product_selector
                }
            });
        }
        res.redirect(`/personalshop/${id}`);
    } else {
        // res.send('unable to connect');
    }
}

module.exports = {
    renderShop,
    userSendProductData
}