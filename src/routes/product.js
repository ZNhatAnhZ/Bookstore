const productController = require('../controllers/product');
const express = require('express');
const router = express.Router();
const authorization = require('../services/authorization');

router.get('/', productController.findProduct);
router.get('/:id', productController.renderProduct);
router.post('/:id', authorization.isLoggedin, productController.addCartItem);
router.post('/buy/:id', authorization.isLoggedin, productController.buyProduct);

module.exports = router



