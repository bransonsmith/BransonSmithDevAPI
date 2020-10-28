const common = require("../common");
const logging = require("../logging");
const models = require('../_services/model-service');

function getCreateValuesString(table_name, body, newId) {
    try {
        const values = models.getModelForTable(table_name).getCreateValues(body, newId);
        let str = '';
        values.forEach(value => {
            str += `${value}, `;
        });
        return str.substr(0, str.length - 2);
    } catch (valueStringError) {
        logging.logError(`Create value string for ${table_name}`, valueStringError);
        return { status: 400, result: common.badRequestMessage };
    }
}

function getUpdateValuesString(table_name, body) {
    const fields = models.getModelForTable(table_name).all_fields.filter(f => f.updateField);

    str = '';
    fields.forEach(field => {
        let val = body[field.name];
        if (field.type.includes('varchar') || field.type.includes('timestamp')) { val = `'${val}'`; }
        str += `${field.name} = ${val}, `;
    });
    return str.substr(0, str.length - 2);
}

function getCreateTableFieldString(table_name) {
    const fields = models.getModelForTable(table_name).all_fields;
    let str = '';
    fields.forEach(field => {
        str += `${field.name} ${field.type} ${field.attributes}, `;
    });
    return str.substr(0, str.length - 2);
}

function getDtoFieldString(table_name) {
    const fields = models.getModelForTable(table_name).all_fields.filter(f => f.onDto);
    let str = '';
    fields.forEach(field => {
        str += `${field.name}, `;
    });
    return str.substr(0, str.length - 2);
}

module.exports.getCreateTableFieldString = getCreateTableFieldString;
module.exports.getDtoFieldString = getDtoFieldString;
module.exports.getCreateValuesString = getCreateValuesString;
module.exports.getUpdateValuesString = getUpdateValuesString;