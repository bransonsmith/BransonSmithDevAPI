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

module.exports.getCurrentTimeStamp =   getCurrentTimeStamp;
module.exports.getNewSessionExpiration = getNewSessionExpiration;
module.exports.getNewId = getNewId;