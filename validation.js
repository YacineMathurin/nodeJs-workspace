// TODO: FINE 3 MINS TUTORIAL
const Joi = require("joi");
const PasswordComplexity = require("joi-password-complexity");

function validateUser(user) {
  const complexityOptions = {
    min: 5,
    max: 255,
    lowerCase: 1,
    upperCase: 2,
    numeric: 2,
    symbol: 1,
    requirementCount: 4,
    /* 
          Min & Max not considered in the count. 
          Only lower, upper, numeric and symbol. 
          requirementCount could be from 1 to 4 
          If requirementCount=0, then it takes count as 4
      */
  };
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    //password: Joi.string().min(5).max(255).required()
    //   some say no required(), TODO: test this
    password: new PasswordComplexity(complexityOptions).required(),
  };
  return Joi.validate(user, schema);
}
