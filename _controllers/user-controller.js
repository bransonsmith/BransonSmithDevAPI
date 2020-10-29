const express = require("express");
let router = express.Router();
const common = require("../common");
const logging = require("../logging");
const userService = require("../_services/user-service");
const baseController = require("../_controllers/base-controller");

const base_route = common.base_route;
const table_name = 'users'

router.get(`${base_route}/${table_name}/token/:token`, (req, response) => {
    logging.logRequest(req);
    const token = req.params.token;

    userService.getUserByToken(token).then(serviceResponse => {
        baseController.handleServiceResponse(serviceResponse, req, response);
    });
});

module.exports.router = router;