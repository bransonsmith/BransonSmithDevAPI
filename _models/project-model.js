const base = require('./base-model');
const Joi = require('joi');

const table_name = 'projects';
const all_fields = [
    { name: 'id',            type: 'varchar(255)',  attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '', onDto: true , createField: false, updateField: false, optional: false },
    { name: 'title',         type: 'varchar(255)',  attributes: 'NOT NULL'            , mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true , optional: false },
    { name: 'codelink',      type: 'varchar(255)',  attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'examplelink',   type: 'varchar(255)',  attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'text',          type: 'varchar(4000)', attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'image',         type: 'varchar(1000)', attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'createddate',   type: 'timestamp',     attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: false, createField: false, updateField: false, optional: false },
    { name: 'codeclicks',    type: 'int',           attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: true , createField: false, updateField: false, optional: false },
    { name: 'exampleclicks', type: 'int',           attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: true , createField: false, updateField: false, optional: false }
];

const createSchema = Joi.object({
    title: Joi.string().required().max(255),
    codelink: Joi.string().allow('').max(255),
    examplelink: Joi.string().allow('').max(255),
    text: Joi.string().allow('').max(4000),
    image: Joi.string().allow('').max(1000)
});
const updateSchema = Joi.object({
    title: Joi.string().required().max(255),
    codelink: Joi.string().allow('').max(255),
    examplelink: Joi.string().allow('').max(255),
    text: Joi.string().allow('').max(4000),
    image: Joi.string().allow('').max(1000)
});

function getCreateValues(body, newId) {
    const datecreated = base.getCurrentTimeStamp();
    const codeClicks = 0;
    const exampleClicks = 0;

    return [
        `'${newId}'`,
        `'${body.title}'`,
        `'${body.codelink}'`,
        `'${body.examplelink}'`,
        `'${body.text}'`,
        `'${body.image}'`,
        `'${datecreated}'`,
        `${codeClicks}`,
        `${exampleClicks}`
    ];
}


module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;