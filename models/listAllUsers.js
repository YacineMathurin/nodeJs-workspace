const Joi = require("joi");
const mongoose = require("mongoose");

const listUsers = mongoose.model(
  "users",
  new mongoose.Schema({
    _data: {},
  })
);
exports.listUsers = listUsers;
