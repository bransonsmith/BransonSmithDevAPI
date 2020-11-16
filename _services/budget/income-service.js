const baseService = require("../base-service");

const table_name = 'incomes';

async function getIncomesByMonth(month, title='Get incomes by month') {
    const sql = `SELECT ${sqlStrings.getDtoFieldString(table_name)} FROM ${table_name} WHERE month = '${month}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    
    const rows = dbResponse.result.rows;
    return { status: 200, result: rows }
}

module.exports.getIncomesByMonth = getIncomesByMonth;