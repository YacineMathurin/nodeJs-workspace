const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");
const dotenv = require('dotenv');
dotenv.config();

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    console.log("FATAL ERROR: jwtPrivateKey not set as config !");
    winston.error("FATAL ERROR: jwtPrivateKey not set as config !");
    process.exit(1);
  }
  // if (!process.env.MONGO_IMAGE_IP || !process.env.DB_NAME) {
  //   console.error("MONGO_IMAGE_IP and DB_NAME should all be set as .env variables");
  //   process.exit(1);
  // }
  // Returns a promise
  // mongoose.connect("mongodb://localhost/playground").then(() => {
  mongoose
    .connect(
      // "mongodb+srv://admin:CloudData1@cluster0-pjomp.mongodb.net/test?retryWrites=true&w=majority"
      // "mongodb://localhost/blachere"
      // To connect to Containerized MongoDB, MONGO_IMAGE_IP and DB_NAME to 
      // be configured in .env file at the root of the project
      `mongodb://${process.env.MONGO_IMAGE_IP}:27017/${process.env.DB_NAME}`,
    )
    .then(() => {
      if (process.env.MONGO_IMAGE_IP && process.env.DB_NAME)
        console.log("Mongoose Connected Successfully to mongo docker", process.env.MONGO_IMAGE_IP, process.env.DB_NAME)
      else
        console.log("Mongoose Connected Successfully")
      winston.info("Successfully Connected to database ...");
    })
    .catch((err) => console.error("Oups, Mongoose Connection failed !", process.env.MONGO_IMAGE_IP, process.env.DB_NAME));
};
