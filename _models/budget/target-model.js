const Joi = require('joi');

const table_name = 'targets';
const all_fields = [
    { name: 'id',         type: 'varchar(255)', attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '',           onDto: true , createField: false, updateField: false, optional: false },
    { name: 'month',      type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',           onDto: true , createField: true , updateField: true , optional: false },
    { name: 'categoryid', type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: true , table: 'categories', onDto: true , createField: true , updateField: true , optional: false },
    { name: 'amount',     type: 'decimal',      attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',           onDto: true , createField: true , updateField: true , optional: false },
];

const createSchema = Joi.object({
    month: Joi.string().regex(/^[.a-zA-Z0-9 ]{1,100}$/),
    categoryid: Joi.string().required().max(255),
    amount: Joi.number().required(),
});
const updateSchema = Joi.object({
    month: Joi.string().regex(/^[.a-zA-Z0-9 ]{1,100}$/),
    categoryid: Joi.string().required().max(255),
    amount: Joi.number().required(),
});

function getCreateValues(body, newId) {
    return [
        `'${newId}'`,
        `'${body.month}'`,
        `'${body.categoryid}'`,
        `${body.amount}`,
    ];
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;