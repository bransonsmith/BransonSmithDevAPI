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
    const passHash = bcrypt.hashSync(req.body.password, 14);
    try {
        attemptLogin(req.body.username, passHash).then(loginResponse => {
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

async function attemptLogin(username, passHash) {
    const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${passHash}'`;
    const getUserResult = await db.executeSql(sql, 'Get User by username/password.');
    try {
        if (getUserResult.status === 'Success') {
            const session = await sessions.createSession(getUserResult.result.id);
            if (session.status === 'Success') {
                await incLogin(getUserResult.result.id);
                return { status: 'Success', result: { user: getUserResult.result, session: session.result } };
            } else {
                return { status: 'Failure', result: 'Failed to create a new session.'}
            }
        } else {
            return { status: 'Failure', result: 'Failed to get user with given credentials.'}
        }
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
