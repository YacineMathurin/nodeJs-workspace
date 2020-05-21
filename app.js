const express = require("express");
const app = express();
const winston = require("winston");

require("./startup/logging")();
require("./startup/startup_routes")(app);
require("./startup/connexion")();
require("./startup/prod")(app);

// Simulate out of express error
// throw new Error("GOT AN STARTUP ERROR");

// const p = Promise.reject(new Error("Miserably failed !"));
// p.then(() => console.log("Done"));

const port = process.env.PORT | 3000;
app.listen(port, () => winston.info(`Listening on port ${port}`));
