const sessionModel = require("../_models/session-model");
const userModel = require("../_models/user-model");
const projectModel = require("../_models/project-model");

function getModelForTable(table_name) {
    switch (table_name) {
        case 'sessions':    return sessionModel;
        case 'users':       return userModel;
        case 'projects':    return projectModel;
        default:            return null;
    }
}

module.exports.getModelForTable = getModelForTable;