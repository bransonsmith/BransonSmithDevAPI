const sqlStrings = require('../../_database/sql-string-factory');
const db = require('../../_database/db');

const table_name = 'targets';

async function getTargetsForMonth(month, title='Get targets for month') {

    const sql = `SELECT ${sqlStrings.getDtoFieldString(table_name)} FROM ${table_name} WHERE month = '${month}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    
    const rows = dbResponse.result.rows;
    return { status: 200, result: rows }
}

module.exports.getTargetsForMonth = getTargetsForMonth;