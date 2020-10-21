const express = require("express");
const common = require("../common")
let router = express.Router();

const { Client } = require('pg');
const client = new Client({
  connectionString: common.connection_string,
  ssl: true,
});
client.connect();

router.get('/', (req, response) => {
    const sql = `SELECT 1 + 1;`;
    common.logReq(req, 'GET', '/', sql);

    client.query(sql).then(res => {
        const result = res.rows[0];
        response.status(200).send(`Succesfully ran some test sql! BransonSmithDevAPI is live :)`); return;
    }).catch(err => {
        console.log(err.stack);
        response.status(400).send(err); return;
    }).finally(() => {});
});

router.post('/initTables', async (req, response) => {
    const message = `This route will call a series of create table functions to set up the database.`;
    common.logReq(req, 'POST', '/initTables', message);
    var resp = '';

    var projectsStatus = await createProjectsTable();
    if (projectsStatus !== 'Success') {
        resp += '\nFailed to create projects table.';
    }

    resp += '\nCompleted creation calls.';
    response.status(200).send(resp); return;
});

async function createProjectsTable() {
    const sql = `CREATE TABLE projects (id varchar(255) NOT NULL PRIMARY KEY, title varchar(255) NOT NULL, text varchar(4000), image varchar(1000), createddate timestamp, codeclicks int, exampleclicks int)`;
    common.logReq(null, 'CREATE', 'Projects Table', sql);

    client.query(sql).then(res => {
        return 'Success';
    }).catch(err => {
        console.log(err.stack);
        return 'Failure';
    }).finally(() => {});
}

module.exports = router;