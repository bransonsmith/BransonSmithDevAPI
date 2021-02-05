const Joi = require('joi');

const table_name = 'discgolfholes';
const all_fields = [
    { name: 'id',         type: 'varchar(255)', attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '',  onDto: true , createField: false, updateField: false, optional: false },
    { name: 'courseid',   type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',  onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'number',     type: 'int',          attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',  onDto: true , createField: true , updateField: true , optional: false  },
    { name: 'par',        type: 'int',          attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',  onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'distance',   type: 'int',          attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',  onDto: true , createField: true , updateField: true , optional: true  },
];

const createSchema = Joi.object({
    courseid: Joi.string().max(255),
    number: Joi.number().required(),
    par: Joi.number(),
    distance: Joi.number(),
});
const updateSchema = Joi.object({
    courseid: Joi.string().max(255),
    number: Joi.number().required(),
    par: Joi.number(),
    distance: Joi.number(),
});

function getCreateValues(body, newId) {
    return [
        `'${newId}'`,
        `'${body.courseid}'`,
        `${body.number}`,
        `${body.par}`,
        `${body.distance}`,
    ];
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;