const { NotFound } = require('../helpers/errors')
const { login, register } = require('../services/authService')
const registerController = async (req, res) => {
    const { email, password } = req.body;
    const newUser = await register(email, password);
    if (newUser) {
        const user = {
            email: newUser.email,
            subscription: newUser.subscription
        }
        return res.status(201).json({ user })
    }
    throw new NotFound('Not found')
}
const loginController = async (req, res) => {
    const { email, password } = req.body;
    const loginData = await login(email, password);
    if (loginData) {
        const token = loginData.token;
        const user = {
            email: loginData.user.email,
            subscription: loginData.user.subscription
        }
        return res.json({ token, user })
    }
    throw new NotFound('Not found')
}
module.exports = {
    registerController,
    loginController
}