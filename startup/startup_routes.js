const registrationRouter = require("../routes/registration");
const loginRouter = require("../routes/login");
const logoutRouter = require("../routes/logout");
const express = require("express");
const err = require("../middlewares/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/signup", registrationRouter);
  app.use("/api/signin", loginRouter);
  app.use("/api/logout", logoutRouter);
  app.use(err);
};
