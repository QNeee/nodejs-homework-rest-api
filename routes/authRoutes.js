const express = require('express')
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { registerController,
    loginController, registerConfirmController, resendConfirmController, patchAvatarsController, logOutController, currentController, usersController } = require('../controllers/authController')
const { authMiddleware } = require('../middlewares/authMiddleware')
const { asyncWrapper } = require('../helpers/apiHelpers')
const { registerValidation, resendValidation } = require('../middlewares/validationmiddleware')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve('./tmp'));
    },
    filename: (req, file, cb) => {
        const [, extension] = file.originalname.split('.');
        cb(null, `${uuidv4()}.${extension}`);
    }
});
const avatarMiddleware = multer({ storage });
router.post('/register', registerValidation, asyncWrapper(registerController));
router.post('/login', registerValidation, asyncWrapper(loginController));
router.post('/logout', authMiddleware, logOutController)
router.post('/current', authMiddleware, currentController);
router.patch('/users', authMiddleware, asyncWrapper(usersController));
router.post('/users/verify', resendValidation, asyncWrapper(resendConfirmController));
router.get('/users/verify/:verificationToken', asyncWrapper(registerConfirmController));
router.patch('/users/avatar', authMiddleware, avatarMiddleware.single('avatar'), asyncWrapper(patchAvatarsController));
module.exports = router;