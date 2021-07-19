const express = require("express");
const router = express.Router();
const { RolePermissions } = require("../../models/permissions");

router.post("/", async (req, res) => {
  var map = [];
  const data = await RolePermissions.find();
  //   console.log("data", data);
  data.forEach((doc, index) => {
    map[index] = doc;
  });
  console.log("map", map);
  //   res.status(200).json({ res: map, message: "RolePermissions" });
  res.status(200).json({ res: map, message: "RolePermissions" });
});

module.exports = router;

// export default {
//   async fetchRolePermissions() {
//     const snap = await db.collection("rolePermissions").get();
//     const map = {};
//     snap.forEach((doc) => {
//       map[doc.id] = doc.data();
//     });
//     return map;
//   },
// };
