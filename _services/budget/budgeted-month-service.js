const baseService = require("../base-service");
const sqlStrings = require('../_database/sql-string-factory');

const table_name = 'budgetedmonths';

async function getBudgetedMonthByMonth(budgetid, month, title='Get budgeted months by month') {
    const sql = `SELECT ${sqlStrings.getDtoFieldString(table_name)} FROM ${table_name} WHERE month = '${month}' AND budgetid = '${budgetid}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    
    const rows = dbResponse.result.rows;
    return { status: 200, result: rows }
}

module.exports.getBudgetedMonthByMonth = getBudgetedMonthByMonth;