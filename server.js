const express = require('express');
const moment = require('moment');
const sessions = require('client-sessions');
const settings = require("./settings");
var cors = require('cors')

const dbRoutes = require("./routes/db");
const projectRoutes = require("./routes/projects");
const userRoutes = require("./routes/users");
const sessionRoutes = require("./routes/sessions").router;
const loginRoutes = require("./routes/login");
const baseRoutes = require("./_controllers/base-controller").router;

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

app.use(dbRoutes.router);
app.use(projectRoutes);
app.use(userRoutes);
app.use(sessionRoutes);
app.use(loginRoutes);
app.use(baseRoutes);

const port = process.env.PORT || 3000;
var server = app.listen(port, () => console.log(`Listening on port ${port}`));
server.timeout = 8000;

var currentDate = moment().format('YYYY-MM-DDThh:mm:ss');
console.log(`${currentDate}`);