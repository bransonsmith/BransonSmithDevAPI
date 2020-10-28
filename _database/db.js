const common = require("../common");
const logging = require("../logging");
const { Client } = require('pg');

const client = new Client({
  connectionString: common.connection_string,
  ssl: true,
});
client.connect();

async function executeSql(sql, title='') {
    try {
        const queryResponse = await client.query(sql);
        logging.logSql(title, sql, queryResponse);
        return { status: 200, result: queryResponse };
    } catch (queryError) {
        logging.logSqlError(title, sql, queryError);
        if (queryError.toString().includes('duplicate key value violates unique constraint')) {
            return handleDuplicateKeyError(queryError.toString());
        }

        return { status: 400, result: common.badRequestMessage };
    }
}

function handleDuplicateKeyError(error) {
    try {
        const details = error.split('"')[1];
        const detSplit = details.split('_');
        return { status: 409, result: `${detSplit[0]} object already exists with the given ${detSplit[1]}.` }
    } catch {
        return { status: 409, result: 'An entity already exists with the given specifications.' };
    }
} 

module.exports.executeSql = executeSql;