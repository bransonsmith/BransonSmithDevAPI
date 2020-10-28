const baseService = require("../_services/base-service");
const db = require("../_database/db");
const common = require("../common");

const table_name = 'sessions';

async function createSessionForUser(userid) {
    return await baseService.create(table_name, { 'userid': userid }, `Create session for user ${userid}`);
}

async function getSessionByToken(token, title=`Get session for token ${token}`) {
    const sql = `SELECT * FROM ${table_name} WHERE token = '${token}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }

    const rows = dbResponse.result.rows;
    if (rows.length < 1) {
        return { status: 404, result: common.notFoundMessage }
    }
    return { status: 200, result: rows[0] }
}

async function removeSessionsForUser(userid, title=`Remove sessions for user ${userid}`) {
    const sql = `DELETE FROM ${table_name} WHERE userid = '${userid}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }

    return { status: 200, result: {} }
}

module.exports.createSessionForUser = createSessionForUser;
module.exports.getSessionByToken = getSessionByToken;
module.exports.removeSessionsForUser = removeSessionsForUser;