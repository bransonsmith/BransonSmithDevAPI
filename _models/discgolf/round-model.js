const Joi = require('joi');

const table_name = 'discgolfrounds';
const all_fields = [
    { name: 'id',         type: 'varchar(255)', attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '',                onDto: true , createField: false, updateField: false, optional: false },
    { name: 'courseid',   type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',                onDto: true , createField: true , updateField: true , optional: true },
    { name: 'date',       type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',                onDto: true , createField: false, updateField: true , optional: true },
];

const createSchema = Joi.object({
    courseid: Joi.string().max(255),
});
const updateSchema = Joi.object({
    courseid: Joi.string().max(255),
    date: Joi.string().required().max(255),
});

function getCreateValues(body, newId) {
    const datecreated = base.getCurrentTimeStamp();
    return [
        `'${newId}'`,
        `'${body.courseid}'`,
        `'${datecreated}'`,
    ];
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;