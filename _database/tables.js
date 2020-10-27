const sessionModel = require("../_models/session-model");

const public_tables = ['sessions'];

function publicTableExists(table_name) {
    return public_tables.includes(table_name);
}

function getModelForTable(table_name) {
    switch (table_name) {
        case 'sessions': return sessionModel;
        default: return null;
    }
}

function validateCreateValues(table_name, body) {
    try {
        return getModelForTable(table_name).validateCreateValues(body);
    } catch {
        return false;
    }
}

function getCreateValuesString(table_name, body, newId) {
    try {
        const values = getModelForTable(table_name).getCreateValues(body, newId);
        return getValuesString(values);
    } catch {
        return '';
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
            const name = f.name;
            const value = body[f.name];
            finalList.push({field: f, value: value});
        });
        return finalList;
    } catch {
        return [];
    }
}

module.exports.public_tables = public_tables;
module.exports.publicTableExists = publicTableExists;
module.exports.getCreateValuesString = getCreateValuesString;
module.exports.validateCreateValues = validateCreateValues;
module.exports.getFieldsThatMustExist = getFieldsThatMustExist;