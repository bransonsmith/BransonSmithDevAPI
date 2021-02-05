const Joi = require('joi');

const table_name = 'discgolfcourses';
const all_fields = [
    { name: 'id',         type: 'varchar(255)', attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '',  onDto: true , createField: false, updateField: false, optional: false },
    { name: 'par',        type: 'int',          attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',  onDto: true , createField: true , updateField: true , optional: true },
    { name: 'distance',   type: 'int',          attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',  onDto: true , createField: true , updateField: true , optional: true },
    { name: 'name',       type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',  onDto: true , createField: true , updateField: true , optional: false },
];

const createSchema = Joi.object({
    par: Joi.number(),
    distance: Joi.number(),
    name: Joi.string().max(255)
});
const updateSchema = Joi.object({
    par: Joi.number(),
    distance: Joi.number(),
    name: Joi.string().max(255)
});

function getCreateValues(body, newId) {
    return [
        `'${newId}'`,
        `${body.par}`,
        `${body.distance}`,
        `'${body.name}'`,
    ];
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;