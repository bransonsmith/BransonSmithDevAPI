const moment = require('moment');
const uuidv1 = require('uuid/v1');

function getCurrentTimeStamp() {
    return moment().format('YYYY-MM-DDThh:mm:ss.SSSZ');
}

function getNewSessionExpiration() {
    return moment(moment().toDate()).add(1, 'M').format('YYYY-MM-DDThh:mm:ss.SSSZ');
}

function getNewId() {
    return uuidv1();
}

function validateString(name, body, options=[]) {
    const sut = body[name];
    if (sut === undefined) { return { status: 409, result: `Request is missing string: ${name}`}; }
    if (!((typeof sut) === 'string')) { return { status: 409, result: `${name} should be of type string`}; }
    return { status: 200, result: '' };
}

module.exports.getCurrentTimeStamp =   getCurrentTimeStamp;
module.exports.getNewSessionExpiration = getNewSessionExpiration;
module.exports.getNewId = getNewId;
module.exports.validateString = validateString;