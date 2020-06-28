//VALIDATION 
const Joi = require('@hapi/joi');
//Register validaion
const registerValidation = (data) => {
    const schema=Joi.object({
        name:Joi.string().min(6).required(),
        email:Joi.string().min(6).required().email(),
        password:Joi.string().min(4).required(),
        contact:Joi.string().max(10).min(10).required()
     });
     return schema.validate(data);
}
//login validation
const loginValidation = (data) => {
    const schema=Joi.object({
        contact:Joi.string().max(10).min(10).required(),
        password:Joi.string().min(4).required()
     });
     return schema.validate(data);
}
module.exports.registerValidation=registerValidation
module.exports.loginValidation=loginValidation