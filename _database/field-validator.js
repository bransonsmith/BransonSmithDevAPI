const base = require("../_models/base-model");
const common = require("../common");
const logging = require("../logging");
const models = require('../_services/model-service');

function validateCreateValues(table_name, body) {
    try {
        const fields = models.getModelForTable(table_name).all_fields.filter(field => field.createField);
        return validateValues(fields, body);
    } catch (createValueError) {
        logging.logError(`Validate create values for ${table_name}`, createValueError);
        return { status: 400, result: common.badRequestMessage };
    }
}

function validateUpdateValues(table_name, body) {
    try {
        const fields = models.getModelForTable(table_name).all_fields.filter(field => field.updateField);
        return validateValues(fields, body);
    } catch (createValueError) {
        logging.logError(`Validate update values for ${table_name}`, createValueError);
        return { status: 400, result: common.badRequestMessage };
    }
}

function validateValues(fields, body) {
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (field.type.includes('varchar')) {
            let validation = base.validateString(field.name, body);
            if (validation.status !== 200) { return validation }
        }
    }
    return { status: 200, result: '' };
}

module.exports.validateCreateValues = validateCreateValues;
module.exports.validateUpdateValues = validateUpdateValues;