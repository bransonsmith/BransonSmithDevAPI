const express = require("express");
const uuidv1 = require('uuid/v1');
const common = require("../common")
let router = express.Router();
const db = require('./db');
const base = require('./base-controller');
const moment = require('moment');

const table_name = 'sessions';
const base_route = `/api/${table_name}`;
const create_table_route = `${base_route}/create`;
const drop_table_route = `${base_route}/drop`;
const fields = [
    { name: 'id',            type: 'varchar(255)',  attributes: 'NOT NULL PRIMARY KEY' },
    { name: 'expiration',    type: 'timestamp',     attributes: 'NOT NULL' },
    { name: 'token',         type: 'varchar(255)',  attributes: 'NOT NULL' },
    { name: 'userid',        type: 'varchar(255)',  attributes: 'NOT NULL' },
    { name: 'datecreated',       type: 'timestamp',  attributes: '' },
];

async function createSession(userid) {
    const expiration = moment(moment().toDate()).add(30, 'm').format('YYYY-MM-DDThh:mm:ss.SSSZ');
    const token = uuidv1();
    const newId = uuidv1();

    const createValues = [
        `'${newId}'`,
        `'${expiration}'`,
        `'${token}'`,
        `'${userid}'`,
        `'${moment().format('YYYY-MM-DDThh:mm:ss.SSSZ')}'`
    ];
    try {
        db.create(table_name, fields, createValues).then(dbResponse => {
            common.logResponse(`Create Session`, dbResponse);
            return dbResponse;
        }).catch(dbError => {
            throw dbError;
        });
    } catch (dbError) {
        common.logError('Base Controller', dbError);
    }
}

async function extendSession(id) {
    try {
        const newDate = moment(moment().toDate()).add(30, 'm').format('YYYY-MM-DDThh:mm:ss.SSSZ');
        const sql = `UPDATE ${table_name} SET expiration = '${newDate}' WHERE id = '${id}';`;
        db.executeSql(sql, `Extend Session`).then(sqlResponse => {
            common.logResponse('Extend Session', sqlResponse);
            response.status(200).send(sqlResponse.result);
        }).catch(sqlError => {
            throw sqlError;
        });;
    } catch (sqlError) {
        common.logError('Sql Error', sqlError);
        response.status(400).send(sqlError);
    }
}

async function getSession(criteria_value, criteria_field_name='id') {
    try {
        db.getOneByACriteria(table_name, criteria_value, criteria_field_name).then(dbResponse => {
            common.logResponse('Get a Session', dbResponse);
        }).catch(dbError => {
            throw dbError;
        });
    } catch (baseError) {
        common.logError('DB', dbError);
    }
}

async function getSessions() {
    try {
        db.getAll(table_name).then(dbResponse => {
            common.logResponse('Get Sessions', dbResponse);
        }).catch(dbError => {
            throw dbError;
        });
    } catch (dbError) {
        common.logError('DB', dbError);
    }
}

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

module.exports.createSession = createSession;
module.exports.extendSession = extendSession;
module.exports.getSession    = getSession;
module.exports.getSessions   = getSessions;
module.exports.router = router;