const express = require("express");
let router = express.Router();
const common = require("../../common");
const logging = require("../../logging");
const baseController = require("../base-controller");
const holeService = require("../../_services/discgolf/hole-service");

const base_route = common.base_route;
const table_name = 'discgolfholes'

router.get(`${base_route}/${table_name}/course/:courseid`, (req, response) => {
    logging.logRequest(req);
    const courseid = req.params.courseid;
    holeService.getHolesForCourse(courseid, req.body).then(serviceResponse => {
        baseController.handleServiceResponse(serviceResponse, req, response);
    });
});

module.exports.router = router;