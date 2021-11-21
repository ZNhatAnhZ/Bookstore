const loginController = require('../controllers/login');
const express = require('express')
const router = express.Router()

router.get('/', loginController.renderLogin)

router.post('/', loginController.Login)

module.exports = router