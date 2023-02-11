const jwt = require('jsonwebtoken');
const { NotAuthorized } = require('../helpers/errors')
const { User } = require('../db/userModel');

const authMiddleware = async (req, res, next) => {
    const [tokenType, token] = req.headers.authorization.split(' ');
    if (!token) {
        next(new NotAuthorized('Please ,provide a token'));
    }
    try {
        const user = jwt.decode(token, process.env.JWT_SECRET);
        const id = user._id;
        const findUser = await User.findById(id);
        req.token = token;
        req.user = user;
        req.email = findUser.email;
        req.subscription = findUser.subscription;
        next();
    } catch (error) {
        throw new NotAuthorized('Invalid Token')
    }
}

module.exports = {
    authMiddleware
}