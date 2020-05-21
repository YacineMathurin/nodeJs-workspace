const Joi = require("joi");

function validateUser(user) {
  const schema = {
    // name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(5).max(255),
  };
  return Joi.validate(user, schema);
}

exports.validateLogin = validateUser;
