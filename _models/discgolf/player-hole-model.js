const Joi = require('joi');

const table_name = 'discgolfplayerholes';
const all_fields = [
    { name: 'id',         type: 'varchar(255)', attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '',                     onDto: true,  createField: false,  updateField: false, optional: false },
    { name: 'playerroundid',   type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: true,  table: 'discgolfplayers', onDto: true,  createField: true ,  updateField: true , optional: false },
    { name: 'holeid',     type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: true,  table: 'discgolfholes',        onDto: true,  createField: true ,  updateField: true , optional: false },
    { name: 'score',      type: 'int',          attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',                     onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'dots',       type: 'int',          attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',                     onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'shots',      type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '',                     onDto: true , createField: true , updateField: true , optional: true  },
];

const createSchema = Joi.object({
    playerroundid: Joi.string().required().max(255),
    holeid: Joi.string().required().max(255),
    score: Joi.number(),
    dots: Joi.number(),
    shots: Joi.string().allow('').max(255),
});
const updateSchema = Joi.object({
    playerroundid: Joi.string().required().max(255),
    holeid: Joi.string().required().max(255),
    score: Joi.number(),
    dots: Joi.number(),
    shots: Joi.string().allow('').max(255),
});

function getCreateValues(body, newId) {
    
    const score = 0;
    const dots = 0;
    const shots = '';

    return [
        `'${newId}'`,
        `'${body.playerroundid}'`,
        `'${body.holeid}'`,
        `${score}`,
        `${dots}`,
        `'${shots}'`,
    ];
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;