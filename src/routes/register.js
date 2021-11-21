const registerController = require('../controllers/register');
const express = require('express')
const router = express.Router()

router.get('/', registerController.renderRegister)

router.post('/', registerController.Register)

module.exports = router