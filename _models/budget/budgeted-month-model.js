const Joi = require('joi');

const table_name = 'budgetedmonths';
const all_fields = [
    { name: 'id',       type: 'varchar(255)', attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '',        onDto: true , createField: false, updateField: false, optional: false },
    { name: 'budgetid', type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: true , table: 'budgets', onDto: true , createField: true , updateField: true , optional: false },
    { name: 'month',    type: 'varchar(255)', attributes: 'NOT NULL UNIQUE',      mustHaveExistingObject: false, table: '',        onDto: true , createField: true , updateField: true , optional: false },
];

const createSchema = Joi.object({
    month: Joi.string().regex(/^[.a-zA-Z0-9 ]{1,100}$/),
    budgetid: Joi.string().required().max(255),
});
const updateSchema = Joi.object({
    month: Joi.string().regex(/^[.a-zA-Z0-9 ]{1,100}$/),
    budgetid: Joi.string().max(255),
});

function getCreateValues(body, newId) {
    return [
        `'${newId}'`,
        `'${body.budgetid}'`,
        `'${body.month}'`,
    ];
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;