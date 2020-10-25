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
        return await createAndGetSession(createValues, newId);
    } catch (createError) {
        common.logError('Create and Get Session', createError);
    }
}

async function createAndGetSession(createValues, newId) {
    const createResponse = await db.create(table_name, fields, createValues);
    if (createResponse.status === 'Success') {
        return await getSession(`'${newId}'`);
    } else {
        return createResponse;
    }
}

async function extendSession(id) {
    try {
        const newDate = moment(moment().toDate()).add(1, 'm').format('YYYY-MM-DDThh:mm:ss.SSSZ');
        const sql = `UPDATE ${table_name} SET expiration = '${newDate}' WHERE id = '${id}';`;
        db.executeSql(sql, `Extend Session`).then(sqlResponse => {
            common.logResponse('Extend Session', sqlResponse);
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
        await deleteExpiredSessions();
        const session = await db.getOneByACriteria(table_name, criteria_value, criteria_field_name);
        console.log('session');
        console.log(session);
        if (session.result.expiration >= Date.now()) { return session; }
        return { status: 'Error', result: 'No session.' };
    } catch (getOneError) {
        common.logError('Get One Session', getOneError);
    }
}

async function getSessions() {
    try {
        await deleteExpiredSessions();
        db.getAll(table_name).then(dbResponse => {
            common.logResponse('Get Sessions', dbResponse);
        }).catch(dbError => {
            throw dbError;
        });
    } catch (dbError) {
        common.logError('DB', dbError);
    }
}

async function deleteExpiredSessions() {
    const nowstamp = moment().format('YYYY-MM-DDThh:mm:ss.SSSZ');
    const sql = `DELETE FROM sessions WHERE expiration < '${nowstamp}'`;
    const dbResponse = await db.executeSql(sql, 'Delete expired sessions');
    common.logResponse('Delete expired sessions', dbResponse);
}

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