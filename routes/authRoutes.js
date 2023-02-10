const express = require('express')
const router = express.Router()
const { registerController,
    loginController, logOutController } = require('../controllers/authController')
const { asyncWrapper } = require('../helpers/apiHelpers')
const { registerValidation } = require('../middlewares/validationmiddleware')
router.post('/register', registerValidation, asyncWrapper(registerController));
router.post('/login', registerValidation, asyncWrapper(loginController));
router.post('/logout', logOutController)
module.exports = router;