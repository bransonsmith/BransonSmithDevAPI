const db = require("../_database/db");
const common = require("../common");

async function getAll(table_name) {
    const sql = `SELECT * FROM ${table_name};`;
    const dbResponse = await db.executeSql(sql);
    if (dbResponse.status !== 200) { return dbResponse; }
    
    const rows = dbResponse.result.rows;
    return { status: 200, result: rows }
}

async function getOne(table_name, id) {
    const sql = `SELECT * FROM ${table_name} WHERE id = '${id}';`;
    const dbResponse = await db.executeSql(sql);
    if (dbResponse.status !== 200) { return dbResponse; }

    const rows = dbResponse.result.rows;
    if (rows.length < 1) {
        return { status: 404, result: common.notFoundMessage }
    }
    return { status: 200, result: rows[0] }
}

module.exports.getAll = getAll;
module.exports.getOne = getOne;