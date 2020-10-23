const express = require("express");
const uuidv1 = require('uuid/v1');
const common = require("../common")
let router = express.Router();
const db = require('./db');
const base = require('./base-controller');
const moment = require('moment');

const table_name = 'projects';
const base_route = `/api/${table_name}`;
const create_table_route = `${base_route}/create`;
const drop_table_route = `${base_route}/drop`;
const get_one_route = `${base_route}/:id`;
const fields = [
    { name: 'id',            type: 'varchar(255)',  attributes: 'NOT NULL PRIMARY KEY' },
    { name: 'title',         type: 'varchar(255)',  attributes: 'NOT NULL' },
    { name: 'codelink',      type: 'varchar(255)',  attributes: '' },
    { name: 'examplelink',   type: 'varchar(255)',  attributes: '' },
    { name: 'text',          type: 'varchar(4000)', attributes: '' },
    { name: 'image',         type: 'varchar(1000)', attributes: '' },
    { name: 'createddate',   type: 'timestamp',     attributes: '' },
    { name: 'codeclicks',    type: 'int',           attributes: '' },
    { name: 'exampleclicks', type: 'int',           attributes: '' },
];

router.post(create_table_route, (req, response) => {
    common.logReq(`POST`, create_table_route);
    try {
        base.createTable(table_name, fields, req, response).then(baseResponse => {
            common.logResponse(create_table_route, baseResponse);
        });
    } catch (baseError) {
        common.logError('Base Controller', baseError);
        response.status(400).send(baseError); return;
    }
});

router.post(drop_table_route, (req, response) => {
    common.logReq(`POST`, drop_table_route);
    try {
        base.dropTable(table_name, fields, req, response).then(baseResponse => {
            common.logResponse(drop_table_route, baseResponse);
        });
    } catch (baseError) {
        common.logError('Base Controller', baseError);
        response.status(400).send(baseError); return;
    }
});

router.get(base_route, (req, response) => {
    common.logReq(`GET`, base_route);
    try {
        base.getAll(table_name, req, response).then(baseResponse => {
            common.logResponse(base_route, baseResponse); return;
        });
    } catch (baseError) {
        common.logError('Base Controller', baseError);
        response.status(400).send(baseError); return;
    }
});

router.get(get_one_route, (req, response) => {
    common.logReq(`GET`, get_one_route);
    try {
        base.getOne(table_name, req, response).then(baseResponse => {
            common.logResponse(get_one_route, baseResponse);
        });
    } catch (baseError) {
        common.logError('Base Controller', baseError);
        response.status(400).send(baseError); return;
    }
});

router.post(base_route, (req, response) => {
    common.logReq(`POST`, base_route);
    const newId = uuidv1();
    const createValues = [
        `'${newId}'`,
        "'Career'",
        "''",
        "'https://ihsmarkit.com/products/wso-software.html'",
        "'Over the last 3 years I have had the opportunity to take part in ...'",
        "''",
        `'${moment().format('YYYY-MM-DDThh:mm:ss.SSSZ')}'`,
        0,
        0
    ];
    try {
        db.create(table_name, fields, createValues).then(dbResponse => {
            common.logResponse('POST /api/projects', dbResponse.result);
            if (dbResponse.status === 'Success') {
                db.getOne(table_name, newId).then(getResponse => {
                    if (getResponse.status === 'Success') {
                        response.status(200).send(getResponse.result); return;
                    } else {
                        response.status(400).send(getResponse.result); return;
                    }
                });
            } else {
                response.status(400).send(dbResponse.result); return;
            }
        }).catch(dbError => {
            throw dbError;
        });
    } catch (dbError) {
        common.logError('Database', dbError);
        response.status(400).send(dbError); return;
    }
});

module.exports = router;