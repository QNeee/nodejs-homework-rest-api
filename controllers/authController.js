const { login, register, resendConfirm, registerConfirm, logout, current, patchUsersSubscription, patchUserAvatar } = require('../services/authService')
const registerController = async (req, res) => {
    const { email, password } = req.body;
    const newUser = await register(email, password);
    const user = {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL
    }
    return res.status(201).json({ user })

}
const registerConfirmController = async (req, res) => {
    const { verificationToken } = req.params;
    await registerConfirm(verificationToken);
    return res.status(200).json({ message: 'Verification successful' });

}
const resendConfirmController = async (req, res) => {
    const { email } = req.body;
    await resendConfirm(email);
    return res.status(200).json({ message: "Verification email sent" })
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
const usersController = async (req, res) => {
    const { _id: owner } = req.user;
    const response = await patchUsersSubscription(owner, req.body);
    return res.status(200).json(response);
}
const patchAvatarsController = async (req, res) => {
    const { _id: owner } = req.user;
    const file = req.file;
    const response = await patchUserAvatar(owner, file);
    return res.status(200).json({ avatarURL: response });
}
module.exports = {
    registerController,
    loginController,
    logOutController,
    currentController,
    usersController,
    patchAvatarsController,
    registerConfirmController,
    resendConfirmController
}