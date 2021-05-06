const Joi = require('joi')

const exerciseValidationSchema = Joi.object().keys({
    description: Joi.string().max(255),
    public: Joi.boolean(),
    calories:  Joi.number().greater(0).required(),
    foodType: Joi.string().max(255),
    grams:Joi.number().greater(0).required(),

})

module.exports = exerciseValidationSchema