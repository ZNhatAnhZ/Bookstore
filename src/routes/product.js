const productController = require('../controllers/product');
const express = require('express')
const router = express.Router()

router.get('/', productController.findProduct);
router.get('/:id', productController.renderProduct);

module.exports = router



