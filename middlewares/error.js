const winston = require("winston");

module.exports = function (error, req, res, next) {
  // message and metadata
  winston.error(error.message, error);
  res.status(500).send("Something went wrong !");
};
