const { Router } = require('express');
const router = new Router();
const userController = require('./controller')

router.post('/login', userController.login);

router.post('/check', userController.checkToken)

module.exports = router;
