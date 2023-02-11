const { login, register, logout, current } = require('../services/authService')
const registerController = async (req, res) => {
    const { email, password } = req.body;
    const newUser = await register(email, password);
    const user = {
        email: newUser.email,
        subscription: newUser.subscription
    }
    return res.status(201).json({ user })

}
const loginController = async (req, res) => {
    const { email, password } = req.body;
    const loginData = await login(email, password);
    const token = loginData.token;
    const user = {
        email: loginData.user.email,
        subscription: loginData.user.subscription
    }
    return res.json({ token, user })
}
const logOutController = async (req, res) => {
    const { _id: owner } = req.user;
    await logout(owner);
    return res.status(204).json({});
}
const currentController = async (req, res) => {
    const { _id: owner } = req.user;
    const response = await current(owner);
    return res.status(200).json({ response });
}
module.exports = {
    registerController,
    loginController,
    logOutController,
    currentController
}