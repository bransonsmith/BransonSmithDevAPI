const express = require("express");
const uuidv1 = require('uuid/v1');
const common = require("../common")
let router = express.Router();
const db = require('./db');
const moment = require('moment');

async function createTable(table_name, fields, req, response) {
    try {
        db.createTable(table_name, fields).then(dbResponse => {
            if (dbResponse.status === 'Success') {
                response.status(200).send(`Created ${table_name}`); return `Created ${table_name}`;
            } else {
                response.status(400).send(`Failed to create ${table_name}: ${dbResponse.result}`); return dbResponse.result;
            }
        }).catch(dbError => {
            throw dbError;
        });
    } catch (dbError) {
        handleDbError(dbError, response);
    }
}

async function dropTable(table_name, req, response) {
    try {
        db.dropTable(table_name).then(dbResponse => {
            if (dbResponse.status === 'Success') {
                response.status(200).send(`Dropped ${table_name}`); return `Dropped ${table_name}`;
            } else {
                response.status(400).send(`Failed to drop ${table_name}: ${dbResponse.result}`); return dbResponse.result;
            }
        }).catch(dbError => {
            throw dbError;
        });
    } catch (dbError) {
        handleDbError(dbError, response);
    }
}

async function getAll(table_name, req, response) {
    try {
        db.getAll(table_name).then(dbResponse => {
            common.logResponse('DB Response', dbResponse);
            handleDbResponse(dbResponse, response);
            return dbResponse.result;
        }).catch(dbError => {
            throw dbError;
        });
    } catch (dbError) {
        handleDbError(dbError, response);
    }
}

async function getOne(table_name, req, response) {
    try {
        db.getOne(table_name, req.params.id).then(dbResponse => {
            common.logResponse('DB Response', dbResponse);
            handleDbResponse(dbResponse, response);
            return dbResponse.result;
        }).catch(dbError => {
            throw dbError;
        });
    } catch (dbError) {
        handleDbError(dbError, response);
    }
}

function handleDbResponse(dbResponse, response) {
    if (dbResponse.status === 'Success') {
        response.status(200).send(dbResponse.result); return dbResponse.result;
    } else {
        response.status(400).send(dbResponse); return dbResponse;
    }
}

function handleDbError(dbError, response) {
    common.logError('Database', dbError);
    response.status(400).send(dbError); return dbError;
}
// router.get('/api/projects/:id', (req, response) => {
//     common.logReq(`GET`, `/api/projects/:id`);
//     try {
//         db.getOne(table_name, req.params.id).then(dbResponse => {
//             common.logResponse(`GET /api/projects/${req.params.id}`, dbResponse.result);
//             if (dbResponse.status === 'Success') {
//                 response.status(200).send(dbResponse.result); return;
//             } else {
//                 response.status(400).send(dbResponse.result); return;
//             }
//         }).catch(dbError => {
//             throw dbError;
//         });
//     } catch (dbError) {
//         common.logError('Database', dbError);
//         response.status(400).send(dbError); return;
//     }
// });

// router.post('/api/projects', (req, response) => {
//     common.logReq(`POST`, `/api/projects`);
//     const newId = uuidv1();
//     const createValues = [
//         `'${newId}'`,
//         "'Career'",
//         "''",
//         "'https://ihsmarkit.com/products/wso-software.html'",
//         "'Over the last 3 years I have had the opportunity to take part in ...'",
//         "''",
//         `'${moment().format('YYYY-MM-DDThh:mm:ss.SSSZ')}'`,
//         0,
//         0
//     ];
//     try {
//         db.create(table_name, fields, createValues).then(dbResponse => {
//             common.logResponse('POST /api/projects', dbResponse.result);
//             if (dbResponse.status === 'Success') {
//                 db.getOne(table_name, newId).then(getResponse => {
//                     if (getResponse.status === 'Success') {
//                         response.status(200).send(getResponse.result); return;
//                     } else {
//                         response.status(400).send(getResponse.result); return;
//                     }
//                 });
//             } else {
//                 response.status(400).send(dbResponse.result); return;
//             }
//         }).catch(dbError => {
//             throw dbError;
//         });
//     } catch (dbError) {
//         common.logError('Database', dbError);
//         response.status(400).send(dbError); return;
//     }
// });

module.exports.createTable = createTable;
module.exports.dropTable = dropTable;
module.exports.getAll = getAll;
module.exports.getOne = getOne;