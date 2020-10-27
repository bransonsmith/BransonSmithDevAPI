const express = require("express");
const common = require("../common");
const tables = require("../_database/tables");
const baseService = require("../_services/base-service");
let router = express.Router();

const base_route = '/api';

router.get(`${base_route}/:table_name`, (req, response) => {
    common.logReq(req.method, req.url);
    const table_name = req.params.table_name;

    if (!tables.publicTableExists(table_name)) { response.status(404).send(common.notFoundMessage); return; }

    baseService.getAll(table_name).then(serviceResponse => {
        try {
            response.status(serviceResponse.status).send(serviceResponse.result); return;
        }
        catch (controllerError) {
            common.logError('Controller', controllerError);
            response.status(400).send('Could not process request.'); return;
        }
    });
});

router.get(`${base_route}/:table_name/:id`, (req, response) => {
    common.logReq(req.method, req.url);
    const table_name = req.params.table_name;
    const id = req.params.id;

    if (!tables.publicTableExists(table_name)) { response.status(404).send(common.notFoundMessage); return; }

    baseService.getOne(table_name, id).then(serviceResponse => {
        try {
            response.status(serviceResponse.status).send(serviceResponse.result); return;
        }
        catch (controllerError) {
            handleControllerError(response);
        }
    });
});

function handleControllerError(response) {
    common.logError('Controller', controllerError);
    response.status(400).send('Could not process request.');
}

module.exports.router = router;