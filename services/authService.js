require('dotenv').config();
const { User } = require('../db/userModel');
const sha256 = require('sha256');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const Jimp = require("jimp");
const fs = require('fs');
const sgMail = require('@sendgrid/mail');
const hostEmail = 'vovasagan7@gmail.com'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const { NotAuthorized, RegistrationConflictError, WrongParametersError, NotFound, BadRequest } = require('../helpers/errors');
const register = async (email, password) => {
    const avatar = gravatar.url(email, { s: '100', r: 'x', d: 'retro' }, true);
    const user = new User({
        email, password, avatarURL: avatar, verificationToken: sha256('adsuHSD')
    })
    const checkUser = await User.findOne({ email });
    if (checkUser) {
        throw new RegistrationConflictError(` Email: ${email} in use`);
    }
    const newUser = await user.save();
    if (newUser) {
        const user = await User.findOne({ email });
        const hostVerify = 'localhost:3000/api/auth/users/verify/';
        const linkVerify = hostVerify + user.verificationToken;
        const msg = {
            to: email, // Change to your recipient
            from: hostEmail, // Change to your verified sender
            subject: 'ty for rega',
            text: linkVerify,
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }
        await sgMail.send(msg);
        return user;
    }
}

const registerConfirm = async (token) => {
    const user = await User.findOne({ verificationToken: token })
    if (!user) {
        throw new NotFound('Not Found');
    }
    await User.findByIdAndUpdate(user._id, { verificationToken: null, verify: true })
}
const resendConfirm = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFound('Not Found');
    }
    if (user.verify === true) {
        throw new BadRequest("Verification has already been passed");
    }
    await User.findByIdAndUpdate(user._id, { verificationToken: null, verify: true })

}
const login = async (email, password) => {
    if (email && password) {
        const user = await User.findOne({ email, verify: true });
        if (!user) {
            throw new NotAuthorized(`no user with email: ${email} found `);
        }
        if (!await bcrypt.compare(password, user.password)) {
            throw new NotAuthorized("Email or password is wrong");
        }
        const token = jwt.sign({
            _id: user._id,
            createdAt: user.createdAt,
        }, process.env.JWT_SECRET)
        return { token, user };
    }
}
const logout = async (owner) => {
    const user = await User.findByIdAndUpdate(owner, { token: "" });
    if (!user) {
        throw new NotAuthorized("Not authorized");
    }

}
const current = async (owner) => {
    const user = await User.findById(owner);
    const currentResponse = {
        email: user.email,
        subscription: user.subscription
    }
    if (!user) {
        throw new NotAuthorized("Not authorized");
    }
    return currentResponse;
}
const patchUsersSubscription = async (owner, body) => {
    const user = await User.findById(owner);
    const sub = body.subscription;
    if (!user) {
        throw new NotAuthorized("Not authorized");
    }
    if (sub !== 'starter' && sub !== 'pro' && sub !== 'business') {
        throw new WrongParametersError('subscription must be starter||pro||business ')
    }
    await User.findByIdAndUpdate(owner, { subscription: sub })
    const updatedStatusUser = await User.findById(owner)
    if (updatedStatusUser) {
        const updatedUser = {
            email: updatedStatusUser.email,
            subscription: sub
        }
        return updatedUser;
    } else {
        throw new NotFound('Not Found');
    }

}
const patchUserAvatar = async (owner, file, params) => {
    const host = "localhost:3000/avatars/"
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized("Not authorized");
    }
    if (!file) {
        throw new WrongParametersError('need file')

    }
    const avatarURL = host + user.email + `=${file.filename}`;
    const [avatarName, extension] = file.filename.split('.');
    await User.findByIdAndUpdate(owner, { avatarURL: avatarURL })
    const updatedStatusUser = await User.findById(owner);
    const oldPath = path.resolve(`./tmp/${avatarName}.${extension}`);
    const newPath = path.resolve(`./public/avatars/${user.email + "=" + avatarName}.${extension}`);
    if (updatedStatusUser) {
        Jimp.read(oldPath, (err, lenna) => {
            if (err) throw err;
            lenna
                .resize(250, 250)
                .write(newPath);
        });
        await fs.unlink(oldPath, err => {
            if (err) throw err; // не удалось удалить файл
        });
        return avatarURL;
    }
}



module.exports = {
    register,
    login,
    logout,
    current,
    patchUsersSubscription,
    patchUserAvatar,
    registerConfirm,
    resendConfirm
}