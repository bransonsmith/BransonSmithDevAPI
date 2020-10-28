const base = require('./base-model');
const bcrypt = require("bcryptjs");

const table_name = 'users';
const all_fields = [
    { name: 'id',            type: 'varchar(255)',  attributes: 'NOT NULL PRIMARY KEY', mustExistOnCreate: false, table: '', onDto: true  },
    { name: 'username',      type: 'varchar(255)',  attributes: 'NOT NULL UNIQUE',      mustExistOnCreate: false, table: '', onDto: true  },
    { name: 'email',         type: 'varchar(255)',  attributes: 'UNIQUE',               mustExistOnCreate: false, table: '', onDto: true  },
    { name: 'password',      type: 'varchar(255)',  attributes: 'NOT NULL',             mustExistOnCreate: false, table: '', onDto: false },
    { name: 'logincount',    type: 'int',           attributes: '',                     mustExistOnCreate: false, table: '', onDto: true  },
    { name: 'createddate',   type: 'timestamp',     attributes: '',                     mustExistOnCreate: false, table: '', onDto: false },
    { name: 'salt',          type: 'varchar(255)',  attributes: 'NOT NULL',             mustExistOnCreate: false, table: '', onDto: false }
];

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

function validateCreateValues(body) {
    try {
        let validation;
        validation = base.validateString('username', body);
        if (validation.status !== 200) { return validation }
        validation = base.validateString('email', body);
        if (validation.status !== 200) { return validation }
        validation = base.validateString('password', body);
        if (validation.status !== 200) { return validation }

        return { status: 200, result: '' };
    } catch {
        return { status: 409, result: `Invalid ${table_name} creation values.` };
    }
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.validateCreateValues = validateCreateValues;