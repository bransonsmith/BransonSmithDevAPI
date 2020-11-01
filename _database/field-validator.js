const base = require("../_models/base-model");
const common = require("../common");
const logging = require("../logging");
const models = require('../_services/model-service');
const Joi = require('joi');

function validateCreateValues(table_name, body) {
    try {
        const model = models.getModelForTable(table_name);
        body = fillOptionalValues(model, body);
        const validation = model.createSchema.validate(body);
        if (validation.error !== null) {
            logging.logError('Create validation', validation.error);
            return { status: 409, result: { message: `${validation.error}`} };
        }
        return { status: 200, result: {} };
    } catch (e) {
        logging.logError(`Validate create values for ${table_name}`, e);
        return { status: 400, result: { message: common.badRequestMessage } };
    }
}

function validateUpdateValues(table_name, body, existing) {
    try {
        const model = models.getModelForTable(table_name);
        body = fillOptionalValues(model, body, existing);
        const validation = model.updateSchema.validate(body);
        if (validation.error !== null) {
            logging.logError('Update validation', validation.error);
            return { status: 409, result: { message: `${validation.error}`} };
        }
        return { status: 200, result: {} };
    } catch (updateValueError) {
        logging.logError(`Validate update values for ${table_name}`, updateValueError);
        return { status: 400, result: { message: common.badRequestMessage } };
    }
}

function fillOptionalValues(model, body, existing = null) {
    const optionalFields = model.all_fields.filter(f => f.optional);
    for (let i = 0; i < optionalFields.length; i++) {
        const field = optionalFields[i];
        if (body[field.name] === undefined) {
            if (existing !== null) { body[field.name] = existing[field]; }
            else { body[field.name] = getDefaultValue(field); }
        }
    }
    return body;
}

function getDefaultValue(field) {
    if (field.type.includes('int')) {
        return 0;
    }
    return '';
}

function validateId(id) {

    const idObj = { id: id };
    const idSchema = Joi.object({
        id: Joi.string().required().regex(/^[a-zA-Z0-9-]{3,40}$/)
    });

    const validation = idSchema.validate(idObj)
    if (validation.error !== null) {
        logging.logError('Id validation', validation.error);
        return { status: 409, result: { message: `${validation.error}`} };
    }
    return { status: 200, result: { }};
}

module.exports.validateCreateValues = validateCreateValues;
module.exports.validateUpdateValues = validateUpdateValues;
module.exports.validateId = validateId;