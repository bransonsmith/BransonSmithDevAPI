const express = require("express");
let router = express.Router();
const common = require("../common");
const logging = require("../logging");
const baseController = require("../_controllers/base-controller");
const loginService = require("../_services/login-service");

const base_route = common.base_route;

router.post(`${base_route}/login`, (req, response) => {
    logging.logRequest(req);
    const body = req.body;

    // get current user by token in header
    // if already logged in, log out current user
    loginService.login(body.username, body.password).then(serviceResponse => {
        baseController.handleServiceResponse(serviceResponse, req, response);
    });
});


module.exports.router = router;