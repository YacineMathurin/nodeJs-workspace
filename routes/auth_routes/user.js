const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const { uuid } = require('uuidv4');


const auth = require("../../middlewares/auth");
const { validateForgotPassword, validateCreate, User } = require("../../models/user");
const { listUsers } = require("../../models/listAllUsers");
const emailingService = require("../../services/server/emailingService")


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
    user, token
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
  const shopToken = req.header("x-shop-token");
  console.log("shopToken", shopToken);
  // const decoded = jwt.verify(shopToken,config.get("blackereKey"));
  // const shopId = decoded.decoded;
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
router.post("/create", async (req, res) => {
  const { body } = req;
  const { user: requestedUser, password: passwordHash, shopId } = body;
  const { firstname, lastname, role, status } = requestedUser;
  // const email = `${}@marieblachere.fr`;
  const email = `${uuid()}@marieblachere.fr`;
  const userInfo = { firstname, lastname, role, email, passwordHash, shopId };
  const displayName = `${firstname} ${lastname}`;
  const emailVerified = false;
  const disabled = false;
  var createdAt = "";
  const localId = uuid();

  const { error } = validateCreate(userInfo);
  if (error) return res.status(400).send(error.details[0].message);
  let user = {};
  let auth = await User.findOne({ email });
  if (auth) return res.status(400).send("User already registred !");

  // Need User for auth collection
  // Need listUsers for users collection

  // Sign up to auth then Add to users collection
  try {
    const salt = await bcrypt.genSalt(10);
    auth = new User({ displayName, role, email, disabled, passwordHash, localId, shopId, emailVerified, salt, createdAt });
    auth.passwordHash = await bcrypt.hash(passwordHash, salt);
    auth.salt = salt;
    auth.createdAt = Date.now();

    const signupResult = await auth.save();
    console.log("signupResult", signupResult);

    if (signupResult.createdAt) {
      user = new listUsers({ email, firstname, lastname, role, id: localId, shopId, _id: localId });
      user = await user.save();
    }
    res
      .status(201)
      .json({ authResponse: { displayName, role, email, localId, shopId }, user });

  } catch (error) {
    throw error;
  }

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
router.post("/requestdelete", async (req, res) => {
  const { body } = req;
  const { id } = body;

  var response = "";
  const filter = { id };

  try {
    response = await listUsers.updateOne(filter, { $set: { status: "pendingDeletion" } });
    // emailingService()
    console.log("Res", response);
    res
      .status(200)
      .json({ res: response, message: "pending deletion set!" });
  } catch (error) {
    console.error(error);
  }

});
router.post("/approuvedelete", async (req, res) => {
  const { body } = req;
  const { id } = body;
  var response = "";
  const userFilter = { id };
  const authFilter = { localId: id };

  try {
    const { deletedCount } = await listUsers.deleteOne(userFilter);
    if (deletedCount === 1) {
      response = await User.deleteOne(authFilter);
      console.log("Auth Response", response);
    }
    res
      .status(200)
      .json({ res: response, message: "user deleted !" });
  } catch (error) {
    console.error(error);
  }

});

module.exports = router;
