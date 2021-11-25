const userController = require('../controllers/user');
const express = require('express')
const router = express.Router()
const authorization = require('../services/authorization');

router.get('/', userController.findUser);
router.get('/:id', authorization.isLoggedin, userController.renderUser);
router.post('/:id', authorization.isLoggedin, userController.changePassword);

module.exports = router