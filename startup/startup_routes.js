const registrationRouter = require("../routes/registration");
const loginRouter = require("../routes/auth");
const express = require("express");
const err = require("../middlewares/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/signup", registrationRouter);
  app.use("/api/signin", loginRouter);
  app.use(err);
};
