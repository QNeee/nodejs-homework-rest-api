const express = require('express')
const router = express.Router()
const { registerController,
    loginController, logOutController, currentController, usersController } = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/authMiddleware')
const { asyncWrapper } = require('../helpers/apiHelpers')
const { registerValidation } = require('../middlewares/validationmiddleware')
router.post('/register', registerValidation, asyncWrapper(registerController));
router.post('/login', registerValidation, asyncWrapper(loginController));
router.post('/logout', authMiddleware, logOutController)
router.post('/current', authMiddleware, currentController);
router.patch('/users', authMiddleware, asyncWrapper(usersController));
module.exports = router;