require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

module.exports = function () {
  winston.add(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "error.log", level: "error" })
  );
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/playground",
      level: "error",
    })
  );
  //   winston.exceptions.handle(
  //     new winston.transports.File({ filename: "exceptions.log" })
  //   );
  process.on("uncaughtException", (ex) => {
    console.log("UNCAUGHT EXECPTION", ex);
    winston.error(ex.message, ex);
    // process.exit(1);
  });
  process.on("unhandledRejection", (ex) => {
    console.log("UNHANDLED REJECTION", ex);
    winston.error(ex.message, ex);
    // process.exit(1);
  });
};
