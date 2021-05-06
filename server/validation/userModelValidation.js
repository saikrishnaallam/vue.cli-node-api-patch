const Joi = require('joi')

const userValidationSchema = Joi.object().keys({
    username: Joi.string().max(255).required(),
    firstName: Joi.string().max(255),
    lastName: Joi.string().max(255),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(1),
})

module.exports = userValidationSchema