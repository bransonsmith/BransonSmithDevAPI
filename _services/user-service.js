const db = require("../_database/db");
const common = require("../common");

const table_name = 'users';

async function getByUsername(username, title=`Get user by username`) {
    console.log('username');
    console.log(username);
    const sql = `SELECT * FROM ${table_name} WHERE username = '${username}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }

    const rows = dbResponse.result.rows;
    if (rows.length < 1) {
        return { status: 404, result: common.notFoundMessage }
    }
    return { status: 200, result: rows[0] }
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

module.exports.getByUsername = getByUsername;
module.exports.incLoginCount = incLoginCount;
module.exports.getDtoFrom = getDtoFrom;