const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

const auth = require("../../middlewares/auth");
const { validateForgotPassword, User } = require("../../models/user");
const { listUsers } = require("../../models/listAllUsers");
router.post("/gettoken", auth, async (req, res) => {
  const token = req.header("x-auth-token");
  res.status(200).json({
    res: token,
    message: "Have the user's token !",
  });
});
router.post("/isauthenticated", auth, async (req, res) => {
  console.log(req.user);
  res.status(200).json({
    res: true,
    uid: req.user._id,
    message: "User is authenticated !",
  });
});
router.post("/forgotpassword", async (req, res) => {
  const { body } = req;
  const { newPassword, userId } = body;
  const { error } = validateForgotPassword(body);
  if (error) return res.send({ status: 400, res: error.details[0].message });

  let user = await User.findOne({ _id: userId });
  if (!user) return res.send({ res: "Not registred email !", status: 404 });
  // User is known
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newPassword, salt, async function (err, hash) {
      if (err) return res.send({ res: "Oups ...", status: 400 });
      // Store hash in your password DB.
      console.log("hash: ", hash);
      user.password = hash;
      await user.save();
    });
  });
  res.status(200).json({ res: "", message: "Password edited !" });
});
router.post("/all", async (req, res) => {
  console.log("req", req);
  const allUsers = await listUsers.find().limit(20);
  // console.log(allUsers);
  var newArray = [];
  allUsers.forEach((user) => {
    console.log("user", user);
    console.log("user picked", user["_data"]);

    newArray.push(user["_data"]);
  });
  res
    .status(200)
    // .header("Access-Control-Allow-Origin", "*")
    .header({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    })
    .json({ res: newArray, message: "All users !" });
});
router.post("/getprofile", async (req, res) => {
  const { body } = req;
  const { userId } = body;
  const profile = await listUsers.findOne({ id: userId });

  res
    .status(200)
    .header("Access-Control-Allow-Origin", "*")
    .json({ res: profile, message: "user's profile !" });
});
router.post("/shopuserprofile ", async (req, res) => {
  const { body } = req;
  const { userId, shopId } = body;

  const user = await listUsers.findOne({ id: userId });
  // console.log(allUsers);
  var newArray = [];
  allUsers.forEach((user) => {
    console.log("user", user);
    console.log("user picked", user["_data"]);

    newArray.push(user["_data"]);
  });
  res
    .status(200)
    .header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS")
    .json({ res: newArray, message: "All users !" });
});

module.exports = router;
