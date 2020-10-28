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

    checkIfRouteIsPublic(table_name, req, response, 'getAll');
    
    baseService.getAll(table_name).then(serviceResponse => {
        handleServiceResponse(serviceResponse, req, response);
    });
});

router.get(`${base_route}/:table_name/:id`, (req, response) => {
    logging.logRequest(req);
    const table_name = req.params.table_name;
    const id = req.params.id;

    checkIfRouteIsPublic(table_name, req, response, 'getOne');

    baseService.getOne(table_name, id).then(serviceResponse => {
        handleServiceResponse(serviceResponse, req, response);
    });
});

router.post(`${base_route}/:table_name`, (req, response) => {
    logging.logRequest(req);
    const table_name = req.params.table_name;
    const body = req.body;

    checkIfRouteIsPublic(table_name, req, response, 'create');

    baseService.create(table_name, body).then(serviceResponse => {
        handleServiceResponse(serviceResponse, req, response);
    });
});

router.put(`${base_route}/:table_name/:id`, (req, response) => {
    logging.logRequest(req);
    const table_name = req.params.table_name;
    const id = req.params.id;
    const body = req.body;

    checkIfRouteIsPublic(table_name, req, response, 'update');

    baseService.update(table_name, id, body).then(serviceResponse => {
        handleServiceResponse(serviceResponse, req, response);
    });
});

router.delete(`${base_route}/:table_name/:id`, (req, response) => {
    logging.logRequest(req);
    const table_name = req.params.table_name;
    const id = req.params.id;

    checkIfRouteIsPublic(table_name, req, response, 'remove');

    baseService.remove(table_name, id).then(serviceResponse => {
        handleServiceResponse(serviceResponse, req, response);
    });
});

router.post(`${base_route}/:table_name/table/drop`, (req, response) => {
    logging.logRequest(req);
    const table_name = req.params.table_name;

    checkIfRouteIsPublic(table_name, req, response, 'dropTable');

    baseService.dropTable(table_name).then(serviceResponse => {
        handleServiceResponse(serviceResponse, req, response);
    });
});

router.post(`${base_route}/:table_name/table/create`, (req, response) => {
    logging.logRequest(req);
    const table_name = req.params.table_name;

    checkIfRouteIsPublic(table_name, req, response, 'initTable');

    baseService.initTable(table_name).then(serviceResponse => {
        handleServiceResponse(serviceResponse, req, response);
    });
});

router.get('/', (req, response) => {
    logging.logRequest(req);

    baseService.getHome().then(serviceResponse => {
        handleServiceResponse(serviceResponse, req, response);
    });
});

function handleServiceResponse(serviceResponse, req, response) {
    try {
        respondAndLog(req, response, serviceResponse); return;
    }
    catch (controllerError) {
        handleControllerError(req, response, controllerError);
    }
}

function respondAndLog(req, response, data) {
    logging.logResponse(req, data);
    response.status(data.status).send(data.result);
}

function handleControllerError(req, response, controllerError) {
    logging.logError('Controller', controllerError);
    respondAndLog(req, response, { status: 400, result: common.badRequestMessage}); return;
}

function checkIfRouteIsPublic(table_name, req, response, routeName) {
    if (!tables.routeIsPublic(table_name, routeName)) {
        respondAndLog(req, response, { status: 404, result: common.notFoundMessage }); return;
    }
}

module.exports.router = router;