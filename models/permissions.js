const Joi = require("joi");
const mongoose = require("mongoose");

const RolePermissions = mongoose.model(
  "rolePermissions",
  new mongoose.Schema({
    data: {},
  })
);
exports.RolePermissions = RolePermissions;
