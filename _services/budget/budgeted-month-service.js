const sqlStrings = require('../../_database/sql-string-factory');
const db = require('../../_database/db');

const table_name = 'budgetedmonths';

async function getBudgetedMonthByMonth(budgetid, month, title='Get budgeted months by month') {
    const sql = `SELECT ${sqlStrings.getDtoFieldString(table_name)} FROM ${table_name} WHERE month = '${month}' AND budgetid = '${budgetid}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    
    const row = dbResponse.result.rows[0];
    return { status: 200, result: row }
}

module.exports.getBudgetedMonthByMonth = getBudgetedMonthByMonth;