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
    common.logReq('GET', '/');
    try {
        executeSql(sql, 'Health Check').then(sqlResult => {
            if (sqlResult.status === 'Success') {
                common.logResponse('GET /', `Succesfully ran some test sql! BransonSmithDevAPI is live :)`);
                response.status(200).send(`Succesfully ran some test sql! BransonSmithDevAPI is live :)`); return;
            } else {
                response.status(400).send(err); return;
            }
        });
    } catch (sqlError) {
        common.logError('Database', sqlError);
        response.status(400).send(sqlError); return;
    }
});

async function executeSql(sql, title='') {
    common.logSql(title, sql);
    try {
        const queryResponse = await client.query(sql);
        let data;
        try {
            data = queryResponse.rows;
        } catch {
            data = queryResponse;
        }
        // common.logResponse('Query', data);
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
    return await handleSqlResults(sqlResults);
}

async function getOne(table_name, id) {
    const sql = `SELECT * FROM ${table_name} WHERE id = '${id}';`;
    var sqlResults = await executeSql(sql, `Get ${table_name} by id`);
    sqlResults.result = sqlResults.result[0];
    return await handleSqlResults(sqlResults);
}

async function create(table_name, fields, values) {
    const sql = `INSERT INTO ${table_name} (${getCreateColumns(fields)})\nVALUES (${getCreateValues(values)});`;
    var sqlResults = await executeSql(sql, `Create new ${table_name}`);
    return await handleSqlResults(sqlResults);
}

async function handleSqlResults(sqlResults) {
    if (sqlResults.status === 'Success') {
        const permissedResults = await getResultsThatUserHasPermissionTo(sqlResults.result);
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
module.exports.getOne = getOne;
module.exports.create = create;
module.exports.executeSql = executeSql;