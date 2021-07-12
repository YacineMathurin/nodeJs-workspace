const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  displayName: {
    type: String,
    required: true,
  },
  localId: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
  },
});
userSchema.methods.generateAuthToken = function () {
  // We're dealing with classes here, so this works fine !
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
};
const User = mongoose.model("auths", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().min(5).max(255).email(),
    password: Joi.string().required().min(5).max(255),
  };
  return Joi.validate(user, schema);
}
function validateForgotPassword(reqBody) {
  const schema = {
    userId: Joi.string().required(),
    newPassword: Joi.string().required().min(5).max(255),
  };
  return Joi.validate(reqBody, schema);
}

exports.User = User;
exports.validateSignUp = validateUser;
exports.validateForgotPassword = validateForgotPassword;
