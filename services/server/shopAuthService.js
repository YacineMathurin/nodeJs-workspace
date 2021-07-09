const fetchAllUsers = require("../../routes/permission_routes/permissionService");
const express = require("express");
const err = require("../../middlewares/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/rolepermissions", fetchAllUsers);
  app.use(err);
};
