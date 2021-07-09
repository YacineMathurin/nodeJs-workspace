const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const auth = require("../../middlewares/auth");
const { validateForgotPassword, User } = require("../../models/user");

router.post("/gettoken", auth, async (req, res) => {
  const token = req.header("x-auth-token");
  res.status(200).json({
    res: token,
    message: "Have the user's token !",
  });
});
router.post("/isauthenticated", auth, async (req, res) => {
  res.status(200).json({
    res: true,
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

module.exports = router;
