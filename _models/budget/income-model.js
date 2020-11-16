const Joi = require('joi');

const table_name = 'incomes';
const all_fields = [
    { name: 'id',              type: 'varchar(255)', attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '',               onDto: true , createField: false, updateField: false, optional: false },
    { name: 'budgetedmonthid', type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: true , table: 'budgetedmonths', onDto: true , createField: true , updateField: true , optional: false },
    { name: 'grossamount',     type: 'decimal',      attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',               onDto: true , createField: true , updateField: true , optional: false },
    { name: 'netamount',       type: 'decimal',      attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',               onDto: true , createField: true , updateField: true , optional: false },
];

const createSchema = Joi.object({
    month: Joi.string().regex(/^[.a-zA-Z0-9 ]{1,100}$/),
    grossamount: Joi.number().required(),
    netamount: Joi.number().required(),
});
const updateSchema = Joi.object({
    month: Joi.string().regex(/^[.a-zA-Z0-9 ]{1,100}$/),
    grossamount: Joi.number().required(),
    netamount: Joi.number().required(),
});

function getCreateValues(body, newId) {
    return [
        `'${newId}'`,
        `'${body.month}'`,
        `${body.grossamount}`,
        `${body.netamount}`,
    ];
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;