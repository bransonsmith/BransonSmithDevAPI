const express = require("express");
let router = express.Router();
const common = require("../../common");
const logging = require("../../logging");
const baseController = require("../base-controller");
const transactionService = require("../../_services/budget/transaction-service");

const base_route = common.base_route;
const table_name = 'transactions'

router.post(`${base_route}/${table_name}/fromcsv`, (req, response) => {
    logging.logRequest(req);

    transactionService.fromcsv(req.body).then(serviceResponse => {
        baseController.handleServiceResponse(serviceResponse, req, response);
    });
});

router.get(`${base_route}/${table_name}/budget`, (req, response) => {
    logging.logRequest(req);

    transactionService.getFilledOutTransactions(req.body).then(serviceResponse => {
        baseController.handleServiceResponse(serviceResponse, req, response);
    });
});

module.exports.router = router;