const Joi = require('joi')

const exerciseValidationSchema = Joi.object().keys({
    type: Joi.string().max(255).required(),
    description: Joi.string().max(255),
    numberOfCaloriesBurned:  Joi.number().greater(0).required(),
    length: Joi.number().greater(0).required(),
    timeUnit: Joi.string().required(),
    public: Joi.boolean()
})

module.exports = exerciseValidationSchema