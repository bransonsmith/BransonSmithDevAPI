const Joi = require('joi');

const table_name = 'labels';
const all_fields = [
    { name: 'id',         type: 'varchar(255)', attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '',           onDto: true , createField: false, updateField: false, optional: false },
    { name: 'name',       type: 'varchar(255)', attributes: 'NOT NULL UNIQUE',      mustHaveExistingObject: false, table: '',           onDto: true , createField: true , updateField: true , optional: false },
    { name: 'autokeys',   type: 'varchar(500)', attributes: 'NOT NULL'            , mustHaveExistingObject: false, table: '',           onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'categoryid', type: 'varchar(255)', attributes: ''                    , mustHaveExistingObject: true , table: 'categories', onDto: true , createField: true , updateField: true , optional: true  },
];

const createSchema = Joi.object({
    name: Joi.string().regex(/^[.a-zA-Z0-9 -]{1,100}$/),
    autokeys: Joi.string().allow('').regex(/^[.a-zA-Z0-9 ,-]{0,500}$/),
    categoryid: Joi.string().allow('').max(255),
});
const updateSchema = Joi.object({
    name: Joi.string().regex(/^[.a-zA-Z0-9 -]{1,100}$/),
    autokeys: Joi.string().allow('').regex(/^[.a-zA-Z0-9 ,-]{0,500}$/),
    categoryid: Joi.string().allow('').max(255),
});

function getCreateValues(body, newId) {
    let autokeys = body.autokeys;
    if (autokeys === undefined) { autokeys = ''; }
    let categoryid = body.categoryid;
    if (categoryid === undefined) { categoryid = ''; }

    return [
        `'${newId}'`,
        `'${body.name}'`,
        `'${autokeys}'`,
        `'${categoryid}'`,
    ];
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;