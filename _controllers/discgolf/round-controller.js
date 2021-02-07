const express = require("express");
let router = express.Router();
const common = require("../../common");
const logging = require("../../logging");
const baseController = require("../base-controller");
const roundService = require("../../_services/discgolf/round-service");

const base_route = common.base_route;
const table_name = 'discgolfrounds'

router.get(`${base_route}/${table_name}/round-data/:roundid`, (req, response) => {
    logging.logRequest(req);
    const roundid = req.params.roundid;
    roundService.getFilledOutRound(roundid, req.body).then(serviceResponse => {
        baseController.handleServiceResponse(serviceResponse, req, response);
    });
});

router.post(`${base_route}/${table_name}/round-data`, (req, response) => {
    logging.logRequest(req);
    const courseid = req.params.courseid;
    const playerids = req.params.playerids;
    roundService.createFilledOutRound(courseid, playerids, req.body).then(serviceResponse => {
        baseController.handleServiceResponse(serviceResponse, req, response);
    });
});

module.exports.router = router;