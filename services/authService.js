const { User } = require('../db/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { NotAuthorized, RegistrationConflictError, WrongParametersError } = require('../helpers/errors')
const register = async (email, password) => {
    if (email && password) {
        const user = new User({
            email, password
        })
        const checkUser = await User.findOne({ email });
        if (checkUser) {
            throw new RegistrationConflictError(` Email: ${email} in use`);
        }
        const newUser = await user.save();
        if (newUser) {
            const user = User.findOne({ email });
            return user;
        }
    } else {
        throw new WrongParametersError('fill all fields')
    }
}

const login = async (email, password) => {
    if (email && password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new NotAuthorized(`no user with email: ${email} found `);
        }
        if (!await bcrypt.compare(password, user.password)) {
            throw new NotAuthorized("Email or password is wrong");
        }
        const token = jwt.sign({
            _id: user._id,
            createdAt: user.createdAt
        }, process.env.JWT_SECRET)
        return { token, user };
    } else {
        throw new WrongParametersError('fill all fields')
    }
}
module.exports = {
    register,
    login
}