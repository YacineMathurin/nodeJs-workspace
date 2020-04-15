const { User } = require("../models/user");
const { validate } = require("../models/signIn");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth");
const asyncMiddleware = require("../middlewares/asyncMiddleware");

router.get("/me", auth, async (req, res) => {
  console.log(User.user);
  res.send(User.user._id);
});
router.get("/logout", auth, async (req, res) => {
  res.header("x-auth-token", "").send("You're now logged out, See you then !");
});
// Second argument is optional and stands for middlewares to protect route
// router.post("/", auth, async (req, res, next) => {
router.post("/", async (req, res, next) => {
  throw Error("access denied");
  // Validate request
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send("Email or Password is wrong !");
  // // Check if already existing
  // let user = await User.findOne({ email: req.body.email }).catch((err) => {
  //   console.log(err);
  // });
  // if (!user) return res.status(400).send("Email or Password is wrong !");
  // //   Good to Signin check
  // const isValidUser = await bcrypt.compare(req.body.password, user.password);
  // if (!isValidUser) return res.status(400).send("Email or Password is wrong !");

  // //  Return the token
  // const token = user.generateAuthToken();
  // res.send(token);
});

module.exports = router;
