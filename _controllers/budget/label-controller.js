const express = require("express");
let router = express.Router();
const common = require("../../common");
const logging = require("../../logging");
const baseController = require("../base-controller");
const labelService = require("../../_services/budget/label-service");

const base_route = common.base_route;
const table_name = 'labels'

router.get(`${base_route}/${table_name}/budget`, (req, response) => {
    logging.logRequest(req);

    labelService.getFilledOutTransactions(req.body).then(serviceResponse => {
        baseController.handleServiceResponse(serviceResponse, req, response);
    });
});

module.exports.router = router;