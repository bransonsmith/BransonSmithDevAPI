const express = require("express");
let router = express.Router();
const common = require("../../common");
const logging = require("../../logging");
const baseController = require("../base-controller");
const budgetService = require("../../_services/budget/budget-service");

const base_route = common.base_route;
const table_name = 'budgets'

router.get(`${base_route}/${table_name}/budget/:month`, (req, response) => {
    logging.logRequest(req);

    budgetService.getFilledOutBudgetedMonth(req.body).then(serviceResponse => {
        baseController.handleServiceResponse(serviceResponse, req, response);
    });
});

module.exports.router = router;