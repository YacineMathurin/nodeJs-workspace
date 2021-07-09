const registrationRouter = require("../../routes/auth_routes/registration");
const loginRouter = require("../../routes/auth_routes/login");
const logoutRouter = require("../../routes/auth_routes/logout");
const userTokenRouter = require("../../routes/auth_routes/user");
const express = require("express");
const err = require("../../middlewares/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/signup", registrationRouter);
  app.use("/api/signin", loginRouter);
  app.use("/api/logout", logoutRouter);
  // Are hiding behind this route: /gettoken, /isauthenticated, /forgotpassword
  app.use("/api/user", userTokenRouter);
  app.use(err);
};
