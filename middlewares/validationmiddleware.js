const Joi = require('joi');
const registerValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().required()
    })
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({ status: validationResult.error.details })
    }
    next();
}
const postContactValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().alphanum()
            .min(3)
            .max(12)
            .required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        phone: Joi.string().alphanum()
            .min(3)
            .max(12)
            .required(),
        favorite: Joi.boolean().optional()
    })

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({ status: validationResult.error.details })
    }
    next();
}
const putContactValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().alphanum()
            .min(3)
            .max(12)
            .optional(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
        phone: Joi.string().alphanum()
            .min(3)
            .max(12)
            .optional(),
        favorite: Joi.boolean().optional()
    })
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({ status: validationResult.error.details })
    }
    next();
}
module.exports = {
    postContactValidation,
    putContactValidation,
    registerValidation,

}