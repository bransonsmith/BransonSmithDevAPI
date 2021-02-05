const Joi = require('joi');

const table_name = 'discgolfplayerrounds';
const all_fields = [
    { name: 'id',         type: 'varchar(255)', attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '',               onDto: true , createField: false, updateField: false, optional: false },
    { name: 'playerid',   type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: true, table: 'discgolfplayers', onDto: true , createField: true , updateField: true , optional: false },
    { name: 'roundid',    type: 'varchar(255)', attributes: 'NOT NULL',             mustHaveExistingObject: true, table: 'discgolfrounds',  onDto: true , createField: true , updateField: true , optional: false },
];

const createSchema = Joi.object({
    playerid: Joi.string().required().max(255),
    roundid: Joi.string().required().max(255),
});
const updateSchema = Joi.object({
    playerid: Joi.string().required().max(255),
    roundid: Joi.string().required().max(255),
});

function getCreateValues(body, newId) {
    return [
        `'${newId}'`,
        `'${body.playerid}'`,
        `'${body.roundid}'`,
    ];
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;