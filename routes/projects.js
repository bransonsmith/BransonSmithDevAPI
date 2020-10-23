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
const inc_code_route = `${get_one_route}/inccode`;
const inc_demo_route = `${get_one_route}/incdemo`;
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
            common.logResponse(base_route, baseResponse);
        }).catch(baseError => {
            throw baseError;
        });
    } catch (baseError) {
        common.logError('Base Controller', baseError);
        response.status(400).send(baseError);
    }
});

router.get(get_one_route, (req, response) => {
    common.logReq(`GET`, get_one_route);
    try {
        base.getOne(table_name, req, response).then(baseResponse => {
            common.logResponse(get_one_route, baseResponse);
        }).catch(baseError => {
            throw baseError;
        });
    } catch (baseError) {
        common.logError('Base Controller', baseError);
        response.status(400).send(baseError);
    }
});

router.post(base_route, (req, response) => {
    common.logReq(`POST`, base_route);
    const newId = uuidv1();
    const createValues = [
        `'${newId}'`,
        `'${req.body.title}'`,
        `'${req.body.codelink}'`,
        `'${req.body.examplelink}'`,
        `'${req.body.text}'`,
        `'${req.body.image}'`,
        `'${moment().format('YYYY-MM-DDThh:mm:ss.SSSZ')}'`,
        `0`,
        `0`
    ];
    try {
        base.create(table_name, fields, createValues, newId, response).then(baseResponse => {
            common.logResponse(base_route, baseResponse);
        }).catch(baseError => {
            throw baseError;
        });
    } catch (baseError) {
        common.logError('Base Controller', baseError);
        response.status(400).send(baseError); return;
    }
});

router.put(get_one_route, (req, response) => {
    common.logReq(`PUT`, get_one_route);
    const updateValues = [
        `'${req.body.title}'`,
        `'${req.body.codelink}'`,
        `'${req.body.examplelink}'`,
        `'${req.body.text}'`,
        `'${req.body.image}'`,
        `${req.body.codeclicks}`,
        `${req.body.exampleclicks}`
    ];
    try {
        base.update(table_name, fields, updateValues, req.params.id, response).then(baseResponse => {
            common.logResponse(get_one_route, baseResponse);
        }).catch(baseError => {
            throw baseError;
        });
    } catch (baseError) {
        common.logError('Base Controller', baseError);
        response.status(400).send(baseError); return;
    }
});

router.put(inc_code_route, (req, response) => {
    common.logReq(`POST`, inc_code_route);
    try {
        const sql = `UPDATE ${table_name} SET codeclicks = codeclicks + 1 WHERE id = '${req.params.id}';`;
        db.executeSql(sql, 'Increment Code Clicks on Project').then(sqlResponse => {
            common.logResponse(inc_code_route, sqlResponse);
            response.status(200).send(sqlResponse.result);
        }).catch(sqlError => {
            throw sqlError;
        });
    } catch (sqlError) {
        common.logError('Sql Error', sqlError);
        response.status(400).send(sqlError);
    }
});

router.put(inc_demo_route, (req, response) => {
    common.logReq(`POST`, inc_demo_route);
    try {
        const sql = `UPDATE ${table_name} SET exampleclicks = exampleclicks + 1 WHERE id = '${req.params.id}';`;
        db.executeSql(sql, 'Increment Demo Clicks on Project').then(sqlResponse => {
            common.logResponse(inc_demo_route, sqlResponse);
            response.status(200).send(sqlResponse.result);
        }).catch(sqlError => {
            throw sqlError;
        });
    } catch (sqlError) {
        common.logError('Sql Error', sqlError);
        response.status(400).send(sqlError);
    }
});

module.exports = router;