const express = require('express');
const moment = require('moment');
const uuidv1 = require('uuid/v1');
const sessions = require('client-sessions');
const bcrypt = require('bcryptjs');
const settings = require("./settings");
const csurf = require("csurf");
const nJwt = require("njwt");
var cors = require('cors')

const dbRoutes = require("./routes/db");

const app = express();
app.use(express.json());
app.use(sessions({
    cookieName: "session",
    secret: settings.SESSION_SECRET_KEY,
    duration: settings.SESSION_DURATION,
    activeDuration: settings.SESSION_EXTENSION_DURATION,
    cookie: {
      httpOnly: true,
      ephemeral: settings.SESSION_EPHEMERAL_COOKIES,
      secure: settings.SESSION_SECURE_COOKIES
    }
}));
app.use(cors());
app.use(dbRoutes);

const port = process.env.PORT || 3000;
var server = app.listen(port, () => console.log(`Listening on port ${port}`));
server.timeout = 2000;

var currentDate = moment().format('YYYY-MM-DDThh:mm:ss');
console.log(`${currentDate}`);