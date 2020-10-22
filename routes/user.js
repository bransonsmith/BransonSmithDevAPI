// const express = require("express");
// const uuidv1 = require('uuid/v1');
// const common = require("../common")
// let router = express.Router();
// const db = require('./db');
// const moment = require('moment');

// const table_name = 'users';
// const base_route = `/api/${table_name}`;
// const create_table_route = `${base_route}/create`;
// const drop_table_route = `${base_route}/drop`;
// const get_one_route = `${base_route}/:id`;

// const fields = [
//     { name: 'id',            type: 'varchar(255)',  attributes: 'NOT NULL PRIMARY KEY' },
//     { name: 'username',      type: 'varchar(255)',  attributes: 'NOT NULL' },
//     { name: 'email',         type: 'varchar(255)',  attributes: 'NOT NULL' },
//     { name: 'password',      type: 'varchar(255)',  attributes: 'NOT NULL' },
//     { name: 'createddate',   type: 'timestamp',     attributes: '' }
// ];

// router.post(create_table_route, (req, response) => {
//     common.logReq(`POST`, create_table_route);
//     try {
//         db.createTable(table_name, fields).then(dbResponse => {
//             if (dbResponse.status === 'Success') {
//                 common.logResponse(`POST ${create_table_route}`, `Created ${table_name}`);
//                 response.status(200).send(`Created ${table_name}`); return;
//             } else {
//                 common.logResponse(`POST ${create_table_route}`, dbResponse.result);
//                 response.status(400).send(`Failed to create ${table_name}: ${dbResponse.result}`); return;
//             }
//         }).catch(dbError => {
//             throw dbError;
//         });
//     } catch (dbError) {
//         common.logError('Database', dbError);
//         response.status(400).send(dbError); return;
//     }
// });

// router.post('/api/projects/drop', (req, response) => {
//     common.logReq(`POST`, `/api/projects/drop`);
//     try {
//         db.dropTable(table_name).then(dbResponse => {
//             common.logResponse('POST /api/projects/drop', dbResponse.result);
//             if (dbResponse.status === 'Success') {
//                 common.logResponse('POST /api/projects/drop', `Dropped ${table_name}`);
//                 response.status(200).send(`Dropped ${table_name}`); return;
//             } else {
//                 common.logResponse('POST /api/projects/drop', dbResponse.result);
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

// router.get('/api/projects', (req, response) => {
//     common.logReq(`GET`, `/api/projects`);
//     try {
//         db.getAll(table_name).then(dbResponse => {
//             common.logResponse('GET /api/projects', dbResponse.result);
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

// module.exports = router;