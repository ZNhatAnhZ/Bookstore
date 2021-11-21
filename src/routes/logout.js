const express = require('express')
const router = express.Router()
const logoutController = require('../controllers/logout')

router.post('/', logoutController.Logout)

module.exports = router