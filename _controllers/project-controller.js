const express = require("express");
let router = express.Router();
const common = require("../common");
const logging = require("../logging");
const projectService = require("../_services/project-service");
const baseController = require("../_controllers/base-controller");

const base_route = common.base_route;
const table_name = 'projects'

router.post(`${base_route}/${table_name}/:id/inc/:field`, (req, response) => {
    logging.logRequest(req);
    const id = req.params.id;
    const field = req.params.field;

    projectService.inc(id, field).then(serviceResponse => {
        baseController.handleServiceResponse(serviceResponse, req, response);
    });
});

module.exports.router = router;