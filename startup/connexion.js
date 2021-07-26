const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR: jwtPrivateKey not set as config !");
    winston.error("FATAL ERROR: jwtPrivateKey not set as config !");
    process.exit(1);
  }
  // Returns a promise
  // mongoose.connect("mongodb://localhost/playground").then(() => {
  mongoose
    .connect(
      // "mongodb+srv://admin:CloudData1@cluster0-pjomp.mongodb.net/test?retryWrites=true&w=majority"
      "mongodb://localhost/blachere"
    )
    .then(() => {
      console.log("Connected ...");
      winston.info("Connected to database ...");
    });
};
