const Joi = require('joi');

const table_name = 'budgets';
const all_fields = [
    { name: 'id',       type: 'varchar(255)', attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '', onDto: true , createField: false, updateField: false, optional: false },
    { name: 'name',     type: 'varchar(255)', attributes: 'NOT NULL UNIQUE',      mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true , optional: false },
];

const createSchema = Joi.object({
    name: Joi.string().regex(/^[.a-zA-Z0-9 ]{1,100}$/),
});
const updateSchema = Joi.object({
    name: Joi.string().regex(/^[.a-zA-Z0-9 ]{1,100}$/),
});

function getCreateValues(body, newId) {
    return [
        `'${newId}'`,
        `'${body.name}'`,
    ];
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;