const sqlStrings = require('../../_database/sql-string-factory');
const db = require('../../_database/db');

const table_name = 'targets';

async function getTargetsForIncomes(incomeids, title='Get targets for incomes') {

    const sql = `SELECT ${sqlStrings.getDtoFieldString(table_name)} FROM ${table_name} WHERE incomeid IN ('${incomeids.join("', '")}');`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    
    const rows = dbResponse.result.rows;
    return { status: 200, result: rows }
}

module.exports.getTargetsForIncomes = getTargetsForIncomes;