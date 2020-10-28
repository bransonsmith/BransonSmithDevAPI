const sessionModel = require("../_models/session-model");
const userModel = require("../_models/user-model");
const common = require("../common");
const logging = require("../logging");

const public_tables = ['sessions', 'users'];

function publicTableExists(table_name) {
    return public_tables.includes(table_name);
}

function getModelForTable(table_name) {
    switch (table_name) {
        case 'sessions': return sessionModel;
        case 'users': return userModel;
        default: return null;
    }
}

function validateCreateValues(table_name, body) {
    try {
        return getModelForTable(table_name).validateCreateValues(body);
    } catch (createValueError) {
        logging.logError(`Validate create values for ${table_name}`, createValueError);
        return { status: 400, result: common.badRequestMessage };
    }
}

function getCreateValuesString(table_name, body, newId) {
    try {
        const values = getModelForTable(table_name).getCreateValues(body, newId);
        return getValuesString(values);
    } catch (valueStringError) {
        logging.logError(`Create value string for ${table_name}`, valueStringError);
        return { status: 400, result: common.badRequestMessage };
    }
}

function getValuesString(values) {
    let str = '';
    values.forEach(value => {
        str += `${value}, `;
    });
    return str.substr(0, str.length - 2);
}

function getFieldsThatMustExist(table_name, body) {
    try {
        const fields = getModelForTable(table_name).all_fields;
        const mustExistFields = fields.filter(f => f.mustExistOnCreate);

        let finalList = [];
        mustExistFields.forEach(f => {
            const value = body[f.name];
            finalList.push({field: f, value: value});
        });
        return finalList;
    } catch {
        return [];
    }
}

function getCreateTableFields(table_name) {
    const fields = getModelForTable(table_name).all_fields;
    let str = '';
    fields.forEach(field => {
        str += `${field.name} ${field.type} ${field.attributes}, `;
    });
    return str.substr(0, str.length - 2);
}

function getDtoFieldString(table_name) {
    const fields = getModelForTable(table_name).all_fields.filter(f => f.onDto);
    let str = '';
    fields.forEach(field => {
        str += `${field.name}, `;
    });
    return str.substr(0, str.length - 2);
}

module.exports.public_tables = public_tables;
module.exports.publicTableExists = publicTableExists;
module.exports.getCreateValuesString = getCreateValuesString;
module.exports.validateCreateValues = validateCreateValues;
module.exports.getFieldsThatMustExist = getFieldsThatMustExist;
module.exports.getCreateTableFields = getCreateTableFields;
module.exports.getDtoFieldString = getDtoFieldString;