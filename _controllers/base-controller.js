const express = require("express");
const common = require("../common");
const logging = require("../logging");
const tables = require("../_database/tables");
const baseService = require("../_services/base-service");
let router = express.Router();

const base_route = '/api';

router.get(`${base_route}/:table_name`, (req, response) => {
    logging.logRequest(req);
    const table_name = req.params.table_name;

    if (!tables.publicTableExists(table_name)) { respondAndLog(req, response, { status: 404, result: common.notFoundMessage }); return; }

    baseService.getAll(table_name).then(serviceResponse => {
        try {
            respondAndLog(req, response, serviceResponse); return;
        }
        catch (controllerError) {
            handleControllerError(req, response, controllerError);
        }
    });
});

router.get(`${base_route}/:table_name/:id`, (req, response) => {
    logging.logRequest(req);
    const table_name = req.params.table_name;
    const id = req.params.id;

    if (!tables.publicTableExists(table_name)) { respondAndLog(req, response, { status: 404, result: common.notFoundMessage }); return; }

    baseService.getOne(table_name, id).then(serviceResponse => {
        try {
            respondAndLog(req, response, serviceResponse); return;
        }
        catch (controllerError) {
            handleControllerError(req, response, controllerError);
        }
    });
});

router.post(`${base_route}/:table_name`, (req, response) => {
    logging.logRequest(req);
    const table_name = req.params.table_name;
    const body = req.body;

    if (!tables.publicTableExists(table_name)) { respondAndLog(req, response, { status: 404, result: common.notFoundMessage }); return; }

    baseService.create(table_name, body).then(serviceResponse => {
        try {
            respondAndLog(req, response, serviceResponse); return;
        }
        catch (controllerError) {
            handleControllerError(req, response, controllerError);
        }
    });
});

function respondAndLog(req, response, data) {
    logging.logResponse(req, data);
    response.status(data.status).send(data.result);
}

function handleControllerError(req, response, controllerError) {
    logging.logError('Controller', controllerError);
    respondAndLog(req, response, { status: 400, result: common.badRequestMessage}); return;
}

module.exports.router = router;