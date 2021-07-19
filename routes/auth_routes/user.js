const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");


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
router.post("/isauthenticated", async (req, res) => {
  const token = req.header("x-auth-token");

  var user = false;
  console.log("Token", token);

  if (token) {
    console.log("FIRED !");
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    console.log("decoded jwt: ", decoded);
    try {
      user = await listUsers.find({ id: decoded.id });
      console.log("user", user);
    } catch (error) {
      throw error
    }
  }
  res.status(200).json({
    user,
  });
});
router.post("/forgotpassword", async (req, res) => {
  const { body } = req;
  console.log("body", body);
  const { newPassword, userId } = body;
  const { error } = validateForgotPassword(body);
  if (error) return res.send({ status: 400, res: error.details[0].message });

  let user = await User.findOne({ localId: userId });
  if (!user) return res.send({ res: "Not registred email !", status: 404 });
  // User is known
  console.log("Known user", user);
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newPassword, salt, async function (err, hash) {
      if (err) return res.send({ res: "Oups ...", status: 400 });
      // Store hash in your password DB.
      console.log("hash: ", hash);
      user.passwordHash = hash;
      await user.save();
    });
  });
  res.status(200).json({ res: "", message: "Password edited !" });
});
router.post("/allShopUsers", async (req, res) => {
  // const shopToken = req.header("x-shop-token");
  //   var decoded = jwt_decode(shopToken);
  //   console.log('shopToken', shopToken);
  // console.log(decoded);

  // const allUsers = await listUsers.find().limit(20)
  try {
    const allUsers = await listUsers.find({ shopId: "1933" });

    res
      .status(200)
      .json({ res: allUsers, message: "All users !" });
  } catch (error) {
    throw error
  }

});
router.post("/getprofile", async (req, res) => {
  const { body } = req;
  const { userId } = body;
  const profile = await listUsers.findOne({ id: userId });

  res
    .status(200)
    .json({ res: profile, message: "user's profile !" });
});
router.post("/update", async (req, res) => {
  const { body } = req;
  const { id, user: update } = body;

  var response = "";
  var user = "";
  const filter = { id };

  try {
    response = await listUsers.updateOne(filter, { $set: { role: update.role } });
    console.log("Res", response);
    res
      .status(200)
      .json({ user, res: response, message: "user updated !" });
  } catch (error) {
    console.error(error);
  }

});
router.post("/delete", async (req, res) => {
  const { body } = req;
  const { id } = body;
  var response = "";
  const userFilter = { id };
  const authFilter = { localId: id };

  try {
    const { acknowledged } = await listUsers.deleteOne(userFilter);
    if (acknowledged) {
      response = await User.deleteOne(authFilter);
    }
    res
      .status(200)
      .json({ res: response, message: "user updated !" });
  } catch (error) {
    console.error(error);
  }

});

module.exports = router;
