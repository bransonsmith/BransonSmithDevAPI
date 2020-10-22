const express = require("express");
const uuidv1 = require('uuid/v1');
const common = require("../common")
let router = express.Router();
const db = require('./db');
const moment = require('moment');

const table_name = 'projects';
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

router.post('/api/projects/create', (req, response) => {
    common.logReq(`POST`, `/api/projects/create`);
    try {
        db.createTable(table_name, fields).then(dbResponse => {
            if (dbResponse.status === 'Success') {
                common.logResponse('POST /api/projects/create', `Created ${table_name}`);
                response.status(200).send(`Created ${table_name}`); return;
            } else {
                common.logResponse('POST /api/projects/create', dbResponse.result);
                response.status(400).send(`Failed to create ${table_name}: ${dbResponse.result}`); return;
            }
        }).catch(dbError => {
            throw dbError;
        });
    } catch (dbError) {
        common.logError('Database', dbError);
        response.status(400).send(dbError); return;
    }
});

router.post('/api/projects/drop', (req, response) => {
    common.logReq(`POST`, `/api/projects/drop`);
    try {
        db.dropTable(table_name).then(dbResponse => {
            common.logResponse('POST /api/projects/drop', dbResponse.result);
            if (dbResponse.status === 'Success') {
                common.logResponse('POST /api/projects/drop', `Dropped ${table_name}`);
                response.status(200).send(`Dropped ${table_name}`); return;
            } else {
                common.logResponse('POST /api/projects/drop', dbResponse.result);
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

router.get('/api/projects', (req, response) => {
    common.logReq(`GET`, `/api/projects`);
    try {
        db.getAll(table_name).then(dbResponse => {
            common.logResponse('GET /api/projects', dbResponse.result);
            if (dbResponse.status === 'Success') {
                response.status(200).send(dbResponse.result); return;
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

router.get('/api/projects/:id', (req, response) => {
    common.logReq(`GET`, `/api/projects/:id`);
    try {
        db.getOne(table_name, req.params.id).then(dbResponse => {
            common.logResponse(`GET /api/projects/${req.params.id}`, dbResponse.result);
            if (dbResponse.status === 'Success') {
                response.status(200).send(dbResponse.result); return;
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

router.post('/api/projects', (req, response) => {
    common.logReq(`POST`, `/api/projects`);
    const newId = uuidv1();
    const createFields = [
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
        db.create(table_name, createFields, createValues).then(dbResponse => {
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