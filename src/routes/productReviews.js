const productReviewController = require('../controllers/productReviews');
const express = require('express')
const router = express.Router()

router.get('/:id', productReviewController.getProductRating)

module.exports = router