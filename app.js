const express = require("express");
var cors = require("cors");
const app = express();
const winston = require("winston");
app.use(cors()); // Use this after the variable declaration

require("./startup/logging")();
require("./services/server/authService")(app);
require("./services/server/permissionService")(app);
require("./startup/connexion")();
require("./startup/prod")(app);

// Simulate out of express error
// throw new Error("GOT AN STARTUP ERROR");

// const p = Promise.reject(new Error("Miserably failed !"));
// p.then(() => console.log("Done"));

const port = process.env.PORT | 3000;
app.listen(port, () => winston.info(`Listening on port ${port}`));
