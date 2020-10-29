const db = require("../_database/db");

const table_name = 'projects';

async function inc(id, field, title=`Increment ${field} Count`) {
    if (field !== 'codeclicks' && field !== 'exampleclicks') { return { status: 409, result: { message: 'Inc field not recognized.' } }; }
    const sql = `UPDATE ${table_name} SET ${field} = ${field} + 1 WHERE id = '${id}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    return { status: 200, result: {} };
}

module.exports.inc = inc;