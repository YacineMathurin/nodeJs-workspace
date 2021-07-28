const { User } = require("../../models/user");
const { listUsers } = require("../../models/listAllUsers");
const { validateLogin } = require("../../models/signIn");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../../middlewares/auth");
const asyncMiddleware = require("../../middlewares/asyncMiddleware");
const winston = require("winston");


router.get("/me", auth, async (req, res) => {
  console.log(User.user);
  res.send(User.user._id);
});
router.post("/logout", auth, async (req, res) => {
  res.header("x-auth-token", "").send("You're now logged out, See you then !");
});
// Second argument is optional and stands for middlewares to protect route
// Did you guys mean axios.get('url', {headers: {"x-dsi-restful":1}})
// router.post("/", auth, async (req, res, next) => {
router.post("/", async (req, res, next) => {
  // throw Error("access denied");
  // Validate request
  // console.log(req.body);
  const { email, password } = req.body;

  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send("Email or Password is wrong !");
  // Check if already existing
  let user = await User.findOne({ email: email.toLowerCase() }).catch((err) => {
    console.log(err);
    throw err;
  });
  console.log("email", email.toLowerCase());
  let agent = await listUsers.findOne({ email: email }).catch((err) => {
    console.log(err);
    throw err;
  });
  console.log("Agent", agent);
  if (!user) return res.status(400).send("Not registred !");
  if (agent.status === "pendingDeletion") {
    winston.error("User has no rights !");
    throw "User has no rights";
    return res.status(403).json({ message: "User has no rights" });
  }
  console.log("All good !", user);
  //   Good to Signin check
  const isValidUser = await bcrypt.compare(req.body.password, user.passwordHash);
  if (!isValidUser)
    return res
      .status(400)
      .send("Email or Password is wrong, authentication failed !");

  //  Return the token
  const token = user.generateAuthToken();
  res.header("x-auth-token", token).json({ user, token });
});

module.exports = router;
