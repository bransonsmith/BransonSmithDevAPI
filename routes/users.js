const express = require("express");
const uuidv1 = require('uuid/v1');
const common = require("../common")
let router = express.Router();
const db = require('./db');
const sessions = require('./sessions');
const base = require('./base-controller');
const moment = require('moment');
const bcrypt = require("bcryptjs");
const { get } = require("http");

const table_name = 'users';
const base_route = `/api/${table_name}`;
const create_table_route = `${base_route}/table/create`;
const drop_table_route = `${base_route}/table/drop`;
const get_one_route = `${base_route}/:id`;
const get_by_token = `${base_route}/token/:token`;
const inc_login_route = `${get_one_route}/inclogin`;
const fields = [
    { name: 'id',            type: 'varchar(255)',  attributes: 'NOT NULL PRIMARY KEY' },
    { name: 'username',      type: 'varchar(255)',  attributes: 'NOT NULL UNIQUE' },
    { name: 'email',         type: 'varchar(255)',  attributes: 'UNIQUE' },
    { name: 'password',      type: 'varchar(255)',  attributes: 'NOT NULL' },
    { name: 'logincount',    type: 'int',           attributes: '' },
    { name: 'createddate',   type: 'timestamp',     attributes: '' }
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

router.get(get_by_token, (req, response) => {
    common.logReq(`GET`, get_by_token);
    try {
        getUserByToken(req.params.token).then(userResponse => {
            common.logResponse('User', userResponse);
            if (userResponse.status === 'Error') {
                if (userResponse.result === 'No session.') {
                    response.status(401).send('Not currently logged in.');
                }
            }
            response.status(200).send(
                {
                    id: userResponse.result.id,
                    username: userResponse.result.username,
                    email: userResponse.result.email
                }
            );
        });
    } catch (baseError) {
        common.logError('Base Controller', baseError);
        response.status(400).send(baseError);
    }
});

router.post(base_route, (req, response) => {
    common.logReq(`POST`, base_route);
    const newId = uuidv1();
    const passHash = bcrypt.hashSync(req.body.password, 14);
    const createValues = [
        `'${newId}'`,
        `'${req.body.username}'`,
        `'${req.body.email}'`,
        `'${passHash}'`,
        `0`,
        `'${moment().format('YYYY-MM-DDThh:mm:ss.SSSZ')}'`
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
    const passHash = bcrypt.hashSync(req.body.password, 14);
    const updateFields = [
       'username',
       'email',
       'password'
    ];
    const updateValues = [
        `'${req.body.username}'`,
        `'${req.body.email}'`,
        `'${passHash}'`,
    ];
    try {
        base.update(table_name, updateFields, updateValues, req.params.id, response).then(baseResponse => {
            common.logResponse(get_one_route, baseResponse);
        }).catch(baseError => {
            throw baseError;
        });
    } catch (baseError) {
        common.logError('Base Controller', baseError);
        response.status(400).send(baseError); return;
    }
});

router.put(inc_login_route, (req, response) => {
    common.logReq(`POST`, inc_login_route);
    try {
        const sql = `UPDATE ${table_name} SET logincount = logincount + 1 WHERE id = '${req.params.id}';`;
        db.executeSql(sql, 'Increment Login Count on User').then(sqlResponse => {
            common.logResponse(inc_login_route, sqlResponse);
            response.status(200).send(sqlResponse.result);
        }).catch(sqlError => {
            throw sqlError;
        });
    } catch (sqlError) {
        common.logError('Sql Error', sqlError);
        response.status(400).send(sqlError);
    }
});

async function getUserByToken(token) {
    const sessionResponse = await sessions.getSession(`'${token}'`, 'token');
    common.logResponse('Session', sessionResponse);
    if (sessionResponse.status === 'Error') {
        if (sessionResponse.result === 'No session.') {
            return sessionResponse;
        }
    }
    return await db.getOne(table_name, sessionResponse.result.userid);
}

module.exports = router;
