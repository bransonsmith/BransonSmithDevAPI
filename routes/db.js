const express = require("express");
const common = require("../common")
let router = express.Router();

const { Client } = require('pg');
const client = new Client({
  connectionString: common.connection_string,
  ssl: true,
});
client.connect();

router.get('/', async (req, response) => {
    const sql = `SELECT 1 + 1;`;
    common.logReq('GET', '/');
    var sqlResult = await common.executeSql(sql, title='Health Check');

    if (sqlResult === 'Success') {
        response.status(200).send(`Succesfully ran some test sql! BransonSmithDevAPI is live :)`); return;
    } else {
        response.status(400).send(err); return;
    }
});

async function executeSql(sql, title='') {
    common.logSql(title, sql);
    await client.query(sql).then(res => {
        console.log('Sql run was successful.');
        return { status: 'Success', result: res };
    }).catch(err => {
        console.log('Error during sql run.');
        console.log(err.stack);
        return { status: 'Error', result: err };
    });
}

async function dropTable(table_name) {
    const sql = `DROP TABLE ${table_name};`;
    return await executeSql(sql, `DROP TABLE: ${table_name}`);
}

async function createTable(table_name, fields) {
    const sql = `CREATE TABLE ${table_name} (${getCreateTableFields(fields)})`;
    return await executeSql(sql, `CREATE TABLE: ${table_name}`);
}

function getCreateTableFields(fields) {
    let str = '';
    fields.forEach(field => {
        str += `${field.name} ${field.type} ${field.attributes}, `;
    });
    return str.trimEnd(' ').trimEnd(',');
}

async function getAll(table_name) {
    const sql = `SELECT * FROM ${table_name};`;
    var sqlResults = await executeSql(sql, `GET ALL: ${table_name}`);
    if (sqlResults.status === 'Success') {
        const permissedResults = getResultsThatUserHasPermissionTo(sqlResults.result.rows);
        console.log(`Got ${permissedResults.length} records from ${table_name}.`)
        return { status: 'Success', result: permissedResults }
    } else {
        return { status: 'Error', result: sqlResults.err }
    }

    // client.query(sql).then(res => {
    //     const result = res.rows;
    //     const permissedResults = getResultsThatUserHasPermissionTo(result);
    //     console.log(`Got ${permissedResults.length} records from ${req.params.tablename}.`)
    //     response.status(200).send(permissedResults); return;
    // }).catch(err => {
    //     console.log(err.stack);
    //     response.status(400).send(err); return;
    // }).finally(() => {});
}

async function getResultsThatUserHasPermissionTo(result) {

    // TODO: Implement permissions before adding any sensitive data
    return result;
}

module.exports.router = router;
module.exports.dropTable = dropTable;
module.exports.createTable = createTable;
module.exports.getAll = getAll;