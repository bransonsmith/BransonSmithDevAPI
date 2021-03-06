const express = require('express');
const moment = require('moment');
const sessions = require('client-sessions');
const settings = require("./settings");
const common = require("./common");
const logging = require("./logging");
var cors = require('cors')

const baseRoutes = require("./_controllers/base-controller").router;
const loginRoutes = require("./_controllers/login-controller").router;
const userRoutes = require("./_controllers/user-controller").router;
const projectRoutes = require("./_controllers/project-controller").router;
const transactionRoutes = require("./_controllers/budget/transaction-controller").router;
const labelRoutes = require("./_controllers/budget/label-controller").router;
const budgetRoutes = require("./_controllers/budget/budget-controller").router;
const roundRoutes = require("./_controllers/discgolf/round-controller").router;
const holeRoutes = require("./_controllers/discgolf/hole-controller").router;

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

app.use(loginRoutes);
app.use(userRoutes);
app.use(projectRoutes);
app.use(budgetRoutes);
app.use(transactionRoutes);
app.use(labelRoutes);
app.use(roundRoutes);
app.use(holeRoutes);

// Order matters; this goes last so other controllers can override
app.use(baseRoutes);

app.get('*', function(req, res){
  logging.logRequest(req);
  logging.logResponse(req, { status: 404, result: { message: common.badRequestMessage } });
  res.status(404).send(common.badRequestMessage);
});

const port = process.env.PORT || 3000;
var server = app.listen(port, () => console.log(`Listening on port ${port}`));
server.timeout = 8000;

var currentDate = moment().format('YYYY-MM-DDThh:mm:ss');
console.log(`${currentDate}`);