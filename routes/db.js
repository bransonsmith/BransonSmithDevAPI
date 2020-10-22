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
    try {
        const queryResponse = await client.query(sql);
        const data = queryResponse.rows;
        common.logResponse('Query', data);
        return { status: 'Success', result: data };
    } catch (queryError) {
        common.logError('Query', queryError);
        return { status: 'Error', result: queryError };
    }
}

async function dropTable(table_name) {
    const sql = `DROP TABLE ${table_name};`;
    try {
        var sqlResponse = await executeSql(sql, `Drop ${table_name} table`);
        common.logResponse('Sql Execution', sqlResponse);
        return sqlResponse;
    } catch (sqlError) {
        common.logError('Sql Execution', sqlError);
        return sqlError;
    }
}

async function createTable(table_name, fields) {
    const sql = `CREATE TABLE ${table_name} (${getCreateTableFields(fields)})`;
    try {
        return await executeSql(sql, `Create ${table_name} table`);
    } catch(err) {
        throw err;
    }
}

function getCreateTableFields(fields) {
    let str = '';
    fields.forEach(field => {
        str += `${field.name} ${field.type} ${field.attributes}, `;
    });
    return str.substr(0, str.length - 2);
}

async function getAll(table_name) {
    const sql = `SELECT * FROM ${table_name};`;
    var sqlResults = await executeSql(sql, `Get all ${table_name}`);
    if (sqlResults.status === 'Success') {
        const permissedResults = await getResultsThatUserHasPermissionTo(sqlResults.result);
        console.log(`Got ${permissedResults.length} records from ${table_name}.`)
        return { status: 'Success', result: permissedResults }
    } else {
        return { status: 'Error', result: sqlResults }
    }
}

async function getOne(table_name, id) {
    const sql = `SELECT * FROM ${table_name} WHERE id = '${id}';`;
    var sqlResults = await executeSql(sql, `Get ${table_name} by id`);
    if (sqlResults.status === 'Success') {
        const permissedResults = await getResultsThatUserHasPermissionTo(sqlResults.result);
        if (permissedResults.length < 1) {
            return { status: 'Success', result: null }
        }
        return { status: 'Success', result: permissedResults[0] }
    } else {
        return { status: 'Error', result: sqlResults }
    }
}

async function create(table_name, fields, values) {
    const sql = `INSERT INTO ${table_name} (${getCreateColumns(fields)})\nVALUES (${getCreateValues(values)});`;
    var sqlResults = await executeSql(sql, `Create new ${table_name}`);
    if (sqlResults.status === 'Success') {
        const permissedResults = await getResultsThatUserHasPermissionTo(sqlResults.result);
        console.log(`Got ${permissedResults.length} records from ${table_name}.`)
        return { status: 'Success', result: permissedResults }
    } else {
        return { status: 'Error', result: sqlResults }
    }
}

function getCreateColumns(fields) {
    let str = '';
    fields.forEach(field => {
        str += `${field.name}, `;
    });
    return str.substr(0, str.length - 2);
}


function getCreateValues(values) {
    let str = '';
    values.forEach(value => {
        str += `${value}, `;
    });
    return str.substr(0, str.length - 2);
}

async function getResultsThatUserHasPermissionTo(result) {

    // TODO: Implement permissions before adding any sensitive data
    return result;
}

module.exports.router = router;
module.exports.dropTable = dropTable;
module.exports.createTable = createTable;
module.exports.getAll = getAll;
module.exports.create = create;