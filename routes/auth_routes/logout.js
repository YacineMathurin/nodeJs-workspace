const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");

router.post("/", auth, async (req, res) => {
  res.header("x-auth-token", "").status(200).json({ status: 200, message: "You're now logged out, See you then !" });
});

module.exports = router;
