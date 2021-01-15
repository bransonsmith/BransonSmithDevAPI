const Joi = require('joi');

const table_name = 'incomes';
const all_fields = [
    { name: 'id',              type: 'varchar(255)', attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '',               onDto: true , createField: false, updateField: false, optional: false },
    { name: 'budgetedmonthid', type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: true , table: 'budgetedmonths', onDto: true , createField: true , updateField: true , optional: false },
    { name: 'grossamount',     type: 'decimal',      attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',               onDto: true , createField: true , updateField: true , optional: false },
    { name: 'netamount',       type: 'decimal',      attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',               onDto: true , createField: true , updateField: true , optional: false },
    { name: 'name',            type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',               onDto: true , createField: true , updateField: true , optional: false },
];

const createSchema = Joi.object({
    budgetedmonthid: Joi.string().max(255),
    grossamount: Joi.number().required(),
    netamount: Joi.number().required(),
    name: Joi.string().max(255),
});
const updateSchema = Joi.object({
    budgetedmonthid: Joi.string().max(255),
    grossamount: Joi.number().required(),
    netamount: Joi.number().required(),
    name: Joi.string().max(255),
});

function getCreateValues(body, newId) {
    return [
        `'${newId}'`,
        `'${body.budgetedmonthid}'`,
        `${body.grossamount}`,
        `${body.netamount}`,
        `${body.name}`,
    ];
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;