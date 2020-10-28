const common = require("../common");
const logging = require("../logging");
const userService = require("../_services/user-service");
const sessionService = require("../_services/session-service");
const bcrypt = require("bcryptjs");

async function login(username, password, title=`Login ${username}`) {

    try {
        const existingUserResponse = await userService.getByUsername(username);
        if (existingUserResponse.status !== 200) { return { status: 409, result: common.badLoginMessage }; }
        const user = existingUserResponse.result;
        if (!bcrypt.compareSync((password + user.salt), user.password)) {
            console.log('Incorrect Password.');
            return { status: 409, result: common.badLoginMessage };
        }

        const createSessionResponse = await sessionService.createSessionForUser(user.id);
        if (createSessionResponse.status !== 200) { return createSessionResponse; }
        const session = createSessionResponse.result;
        await userService.incLoginCount(user.id);
        const userDto = userService.getDtoFrom(user);
        return {
            status: 200,
            result: {
                user: userDto,
                token: session.token
            }
        };
    } catch (getError) {
        logging.logError(`Login Error`, getError);
        return { status: 400, result: common.badRequestMessage }
    }

}

async function logout(token, title=`Logout`) {

    try {
        const sessionResponse = await sessionService.getSessionByToken(token);
        if (sessionResponse.status !== 200) { return { status: 200, result: 'No active session.' }; }

        const userid = sessionResponse.result.userid;
        const removeSessionsResponse = await sessionService.removeSessionsForUser(userid);
        if (removeSessionsResponse.status !== 200) { return removeSessionsResponse; }

        return { status: 200, result: 'Logged Out.' };
    } catch (getError) {
        logging.logError(`Logout Error`, getError);
        return { status: 400, result: common.badRequestMessage }
    }

}

module.exports.login = login;
module.exports.logout = logout;