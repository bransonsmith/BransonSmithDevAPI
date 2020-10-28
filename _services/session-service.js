const baseService = require("../_services/base-service");

const table_name = 'sessions';

async function createSessionForUser(userid) {
    return await baseService.create(table_name, { 'userid': userid }, `Create session for user ${userid}`);
}

async function getSessionByToken(token) {

}

module.exports.createSessionForUser = createSessionForUser;