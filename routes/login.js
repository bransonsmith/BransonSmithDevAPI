const express = require("express");
const uuidv1 = require('uuid/v1');
const common = require("../common")
const sessions = require("./sessions")
let router = express.Router();
const db = require('./db');
const base = require('./base-controller');
const moment = require('moment');
const bcrypt = require("bcryptjs");

const login_route = `/api/login`;
const logout_route = `/api/logout`;

router.post(login_route, (req, response) => {
    common.logReq(`POST`, login_route);
    try {
        attemptLogin(req.body.username, req.body.password).then(loginResponse => {
            common.logResponse('Login', loginResponse);
            if (loginResponse.status === 'Success') {
                response.status(200).send(loginResponse.result);
            } else {
                response.status(400).send(loginResponse.result);
            }
        }).catch(loginError => {
            throw loginError;
        });
    } catch (loginError) {
        common.logError('Login Controller', loginError);
        response.status(400).send(loginError); return;
    }
});

async function attemptLogin(username, password) {
    const sql = `SELECT * FROM users WHERE username = '${username}'`;
    const getUserResult = await db.executeSql(sql, 'Get User by username');
    try {
        if (getUserResult.status !== 'Success') { return getUserResult; }
        const user = getUserResult.result[0];
        if (!bcrypt.compareSync(password, user.password)) { return { status: 'Failure', result: 'Incorrect Password' }}

        const createSessionResponse = await sessions.createSession(user.id);
        if (createSessionResponse.status !== 'Success') { return createSessionResponse; }
        const session = createSessionResponse.result;
        await incLogin(user.id);
        return { status: 'Success', result: { user: user, token: session.token } };
    } catch (loginError){
        common.logError('Attempt Login', loginError);
        return { status: 'Error', result: loginError}
    }
}

async function incLogin(userId) {
    try {
        const sql = `UPDATE users SET logincount = logincount + 1 WHERE id = '${userId}';`;
        db.executeSql(sql, 'Increment Login Count on User').then(sqlResponse => {
            common.logResponse('Inc Login Count', sqlResponse);
        }).catch(sqlError => {
            throw sqlError;
        });
    } catch (sqlError) {
        common.logError('Sql Error', sqlError);
    }
}

module.exports = router;
