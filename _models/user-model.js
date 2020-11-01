const base = require('./base-model');
const bcrypt = require("bcryptjs");
const Joi = require('joi');

const table_name = 'users';
const all_fields = [
    { name: 'id',            type: 'varchar(255)',  attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '', onDto: true , createField: false, updateField: false },
    { name: 'username',      type: 'varchar(255)',  attributes: 'NOT NULL UNIQUE',      mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true  },
    { name: 'email',         type: 'varchar(255)',  attributes: 'UNIQUE',               mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true  },
    { name: 'password',      type: 'varchar(255)',  attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '', onDto: false, createField: true , updateField: false },
    { name: 'logincount',    type: 'int',           attributes: '',                     mustHaveExistingObject: false, table: '', onDto: true , createField: false, updateField: false },
    { name: 'createddate',   type: 'timestamp',     attributes: '',                     mustHaveExistingObject: false, table: '', onDto: false, createField: false, updateField: false },
    { name: 'salt',          type: 'varchar(255)',  attributes: 'NOT NULL',             mustHaveExistingObject: false, table: '', onDto: false, createField: false, updateField: false }
];

const createSchema = Joi.object({
    username: Joi.string().required().regex(/^[.a-zA-Z0-9_ -]{3,40}$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().regex(/^[.a-zA-Z0-9_ !@#$%^&*()-]{8,40}$/),
});
const updateSchema = Joi.object({
    username: Joi.string().regex(/^[.a-zA-Z0-9_ -]{3,40}$/),
    email: Joi.string().required().email(),
});

function getCreateValues(body, newId) {
    const datecreated = base.getCurrentTimeStamp();
    const salt = base.getNewId();
    const passHash = bcrypt.hashSync(body.password + salt, 14);
    const loginCount = 0;

    return [
        `'${newId}'`,
        `'${body.username}'`,
        `'${body.email}'`,
        `'${passHash}'`,
        `${loginCount}`,
        `'${datecreated}'`,
        `'${salt}'`
    ];
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;