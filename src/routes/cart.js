const cartController = require('../controllers/cart');
const express = require('express')
const router = express.Router()
const authorization = require('../services/authorization');

router.get('/', cartController.getCartItemByUserId);
router.get('/:id', authorization.isLoggedin, cartController.renderCart);

module.exports = router



