const Joi = require("joi");
const mongoose = require("mongoose");

const RolePermissions = mongoose.model(
  // "permissions_packeds",
  "rolepermissions",
  new mongoose.Schema({
    _id: {
      type: String
    },
    _data: {},
  })
);
exports.RolePermissions = RolePermissions;
