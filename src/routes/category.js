const categoryController = require('../controllers/category');
const express = require('express')
const router = express.Router()

router.get('/', categoryController.findCategories)

module.exports = router