const express = require("express");
const uuidv1 = require('uuid/v1');
const common = require("../common")
let router = express.Router();
const db = require('./db');

const table_name = 'projects';
const fields = [
    { name: 'id',            type: 'varchar(255)',  attributes: 'NOT NULL PRIMARY KEY' },
    { name: 'title',         type: 'varchar(255)',  attributes: 'NOT NULL' },
    { name: 'text',          type: 'varchar(4000)', attributes: '' },
    { name: 'image',         type: 'varchar(1000)', attributes: '' },
    { name: 'createddate',   type: 'timestamp',     attributes: '' },
    { name: 'codeclicks',    type: 'int',           attributes: '' },
    { name: 'exampleclicks', type: 'int',           attributes: '' },
];

router.post('/api/projects/create', async (req, response) => {
    common.logReq(`POST`, `/api/projects/create`);
    const dbResult = await db.createTable(table_name, fields);
    if (dbResult.status === 'Success') {
        response.status(200).send(dbResult.result); return;
    } else {
        response.status(400).send(dbResult.result); return;
    }
});

router.post('/api/projects/drop', async (req, response) => {
    common.logReq(`POST`, `/api/projects/drop`);
    try {
        const dbResult = await db.dropTable(table_name);
        if (dbResult.status === 'Success') {
            response.status(200).send(dbResult.result); return;
        } else {
            response.status(400).send(dbResult.result); return;
        }
    } catch (err) {
        console.log('Error in db.dropTable');
        common.logError(err);
        response.status(err.response.status).send(err); return;
    }
});

router.get('/api/projects', async (req, response) => {
    common.logReq(`GET`, `/api/projects`);
    var dbResult = await db.getAll(table_name);
    if (dbResult.status === 'Success') {
        response.status(200).send(dbResult.result); return;
    } else {
        response.status(400).send(dbResult.result); return;
    }
});

// router.post('/api/projects', (req, response) => {
//     console.log('POST /api/projects');
//     console.log(req.body);

//     postNewGolfer(req).then(createdGolfer => {
//         if (createdGolfer) { response.status(200).send(createdGolfer); return createdGolfer; } 
//         else { response.status(500).send('Failed to create golfer.'); return; }
//     });
// });

// router.put('/api/golf/golfers/:id', (req, response) => {

//     const client = new Client({
//         connectionString: 'postgres://jptlnpgqxmpysv:4e82e76ffd96c11ef7a90f6051c5e1f63ec8990c698631832005d83d1296b299@ec2-54-225-173-42.compute-1.amazonaws.com:5432/d1uak9466uurk7',
//         ssl: true,
//       });
//     client.connect();
//     client.query(`SELECT * FROM golfers where id = '${req.params.id}'`).then(res => {

//         if (res.rows.length < 1) { response.status(404).send(`Could not find golfer with id ${req.params.id}`); client.end(); return; }

//         var cmd = `UPDATE golfers SET name='${req.body.name}' where id = '${req.params.id}'`
//         client.query(cmd).then(() => {

//             client.query(`SELECT * FROM golfers where id = '${req.params.id}'`).then(resGolfer => {
//                 console.log('Getting updated golfer.');
//                 const data = resGolfer.rows;
//                 console.log(`Got ${data.length} golfers.`);
//                 data.forEach(row => {
//                     response.status(200).send(row); client.end(); return;
//                 });
//         }).catch(err => {
//             console.log(err.stack);
//             response.status(500).send(err); client.end(); return;
//         }).finally(() => {}
//     );});});
        
//     });

// router.delete('/api/golf/golfers/:id', (req) => {
//     let golferId = req.params.id;
//     const client = new Client({
//         connectionString: 'postgres://jptlnpgqxmpysv:4e82e76ffd96c11ef7a90f6051c5e1f63ec8990c698631832005d83d1296b299@ec2-54-225-173-42.compute-1.amazonaws.com:5432/d1uak9466uurk7',
//         ssl: true,
//       });
//     client.connect();
//     let deleted = client.query(`DELETE FROM golfers where id = '${golferId}'`).then(() => {
//         console.log(`Deleted Golfer ${golferId}`);
//         client.end(); return true;
//     }).catch(err => {
//         console.log(err.stack);
//         client.end(); return false;
//     }).finally(() => {});
//     return deleted;
// });

// async function getGolferWithId(id) {
//     const client = new Client({
//         connectionString: 'postgres://jptlnpgqxmpysv:4e82e76ffd96c11ef7a90f6051c5e1f63ec8990c698631832005d83d1296b299@ec2-54-225-173-42.compute-1.amazonaws.com:5432/d1uak9466uurk7',
//         ssl: true,
//       });
//     client.connect();
//     var golfer = await client.query(`SELECT * FROM golfers where id = '${id}'`).then(res => {
//         if (res.rows.length < 1) { console.log(`No golfers with id.`); client.end(); return false; }
//         const data = res.rows[0];
//         client.end(); return data;
//     }).catch(() => {
//         client.end(); return false;
//     }).finally(() => {});
//     return golfer;
// } 

// async function postNewGolfer(req) {
//     console.log(req.body)
//     var createdId = await createNewGolfer(req.body);
//     if (!createdId) { return false; }

//     var createdGolfer = await getGolferWithId(createdId);
//     console.log(`Created poker hand = ${createdId} `)
//     console.log(createdGolfer)
//     if (!createdGolfer) { return false; }

//     return createdGolfer;
// }

// async function createNewGolfer(body) {
//     var newId = uuidv1();

//     var cmd = `INSERT INTO golfers VALUES ('${newId}', '${body.name}')`;
//     console.log(cmd);

//     const client = new Client({
//         connectionString: 'postgres://jptlnpgqxmpysv:4e82e76ffd96c11ef7a90f6051c5e1f63ec8990c698631832005d83d1296b299@ec2-54-225-173-42.compute-1.amazonaws.com:5432/d1uak9466uurk7',
//         ssl: true,
//       });
//     client.connect();
//     var insertedId = await client.query(cmd).then(() => {
//         console.log('Inserted new golfer into table.')
//         client.end(); return newId;
//     }).catch(err => {
//         console.log(err.stack);
//         client.end(); return false;
//     }).finally(() => {});
//     return insertedId;
// }

module.exports = router;