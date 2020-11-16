const baseService = require("../base-service");

const table_name = 'budgetedmonths';

async function getbudgetedMonthsByMonth(month, title='Get budgeted months by month') {
    const sql = `SELECT ${sqlStrings.getDtoFieldString(table_name)} FROM ${table_name} WHERE month = '${month}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    
    const rows = dbResponse.result.rows;
    return { status: 200, result: rows }
}

module.exports.getbudgetedMonthsByMonth = getbudgetedMonthsByMonth;