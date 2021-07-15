const Joi = require("joi");
const mongoose = require("mongoose");

const listUsers = mongoose.model(
  "users",
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    shopId: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      // required: true,
    },
  })
);
exports.listUsers = listUsers;
