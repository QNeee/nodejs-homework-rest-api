const jwt = require('jsonwebtoken');
const { NotAuthorized } = require('../helpers/errors')

const authMiddleware = (req, res, next) => {
    const [tokenType, token] = req.headers.authorization.split(' ');
    if (!token) {
        next(new NotAuthorized('Please ,provide a token'));
    }
    try {
        const user = jwt.decode(token, process.env.JWT_SECRET);
        req.token = token;
        req.user = user;
        const { _id: owner } = req.user;
        next();
    } catch (error) {
        next(new NotAuthorized('Invalid Token'))
    }
}

module.exports = {
    authMiddleware
}