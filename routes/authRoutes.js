const express = require('express')
const router = express.Router()
const { registerController,
    loginController } = require('../controllers/authController')
const { asyncWrapper } = require('../helpers/apiHelpers')
router.post('/register', asyncWrapper(registerController));
router.post('/login', asyncWrapper(loginController));

module.exports = router;