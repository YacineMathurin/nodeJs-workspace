const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt_decode = require('jwt-decode');


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

  // const allUsers = await listUsers.find().limit(20);
  const allUsers = await listUsers.find({ shopId: "1933" });

  res
    .status(200)
    .json({ res: allUsers, message: "All users !" });
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
  const { id, user: param } = body;
  var response = "";
  var user = "";
  const filter = { id };
  const update = { $set: { lastname: "Yacine" } };

  response = await listUsers.replaceOne(filter, param);
  console.log("Res", response);
  res
    .status(200)
    .json({ user, res: response, message: "user updated !" });

});

module.exports = router;
