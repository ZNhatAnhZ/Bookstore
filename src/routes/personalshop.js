const personalshopController = require('../controllers/personalshop');
const express = require('express')
const router = express.Router()
const authorization = require('../services/authorization');

router.get('/:id', authorization.isLoggedin, personalshopController.renderShop);

module.exports = router