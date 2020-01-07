// Validation
const Joi = require("@hapi/joi");

//register validation

const registerValidation = data => {
  const validationSchema = Joi.object({
    username: Joi.string()
      .min(2)
      .required(),
    email: Joi.string()
      .min(2)
      .email(),
    password: Joi.string()
      .min(2)
      .required()
  });
  return validationSchema.validate(data);
};

const loginValidation = data => {
  const validationSchema = Joi.object({
    username: Joi.string()
      .min(2)
      .required(),
    password: Joi.string()
      .min(2)
      .required()
  });
  return validationSchema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
