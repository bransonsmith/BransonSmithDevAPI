const sqlStrings = require('../../_database/sql-string-factory');

const table_name = 'incomes';

async function getIncomesByBudgetedMonth(budgetedmonthid, title='Get incomes by budgetedmonthid') {
    const sql = `SELECT ${sqlStrings.getDtoFieldString(table_name)} FROM ${table_name} WHERE budgetedmonthid = '${budgetedmonthid}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    
    const rows = dbResponse.result.rows;
    return { status: 200, result: rows }
}

module.exports.getIncomesByBudgetedMonth = getIncomesByBudgetedMonth;