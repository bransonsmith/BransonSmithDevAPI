const common = require("../common");
const { Client } = require('pg');

const client = new Client({
  connectionString: common.connection_string,
  ssl: true,
});
client.connect();

async function executeSql(sql, title='') {
    try {
        const queryResponse = await client.query(sql);
        common.logSql(title, sql, queryResponse);
        return { status: 200, result: queryResponse };
    } catch (queryError) {
        common.logSqlError(title, sql, queryError);
        return { status: 400, result: common.badRequestMessage };
    }
}

module.exports.executeSql = executeSql;