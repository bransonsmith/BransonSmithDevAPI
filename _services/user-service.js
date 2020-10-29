const db = require("../_database/db");
const common = require("../common");
const sessionService = require("../_services/session-service");
const baseService = require("../_services/base-service");

const table_name = 'users';

async function getUserByUsername(username, title=`Get user by username`) {
    const sql = `SELECT * FROM ${table_name} WHERE username = '${username}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }

    const rows = dbResponse.result.rows;
    if (rows.length < 1) {
        return { status: 404, result: common.notFoundMessage }
    }
    return { status: 200, result: rows[0] }
}

async function getUserByToken(token, title=`Get user by token`) {
    const sessionResponse = await sessionService.getSessionByToken(token);
    if (sessionResponse.status !== 200) { return sessionResponse; }
    return await baseService.getOne(table_name, sessionResponse.result.userid);
}

async function incLoginCount(userid, title=`Increment Login Count for user ${userid}`) {
    const sql = `UPDATE users SET logincount = logincount + 1 WHERE id = '${userid}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    return { status: 200, result: {} };
}

function getDtoFrom(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        logincount: user.logincount
    }
}

module.exports.getUserByUsername = getUserByUsername;
module.exports.getUserByToken = getUserByToken;
module.exports.incLoginCount = incLoginCount;
module.exports.getDtoFrom = getDtoFrom;