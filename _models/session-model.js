const base = require('./base-model');

const table_name = 'sessions';
const all_fields = [
    { name: 'id',            type: 'varchar(255)',  attributes: 'NOT NULL PRIMARY KEY', mustExistOnCreate: false, table: ''     , onDto: true  },
    { name: 'expiration',    type: 'timestamp',     attributes: 'NOT NULL',             mustExistOnCreate: false, table: ''     , onDto: false },
    { name: 'token',         type: 'varchar(255)',  attributes: 'NOT NULL',             mustExistOnCreate: false, table: ''     , onDto: true  },
    { name: 'userid',        type: 'varchar(255)',  attributes: 'NOT NULL',             mustExistOnCreate: true , table: 'users', onDto: true  },
    { name: 'datecreated',   type: 'timestamp',     attributes: '',                     mustExistOnCreate: false, table: ''     , onDto: false },
];

function getCreateValues(body, newId) {
    const expiration = base.getNewSessionExpiration();
    const token = base.getNewId();
    const datecreated = base.getCurrentTimeStamp();

    return [
        `'${newId}'`,
        `'${expiration}'`,
        `'${token}'`,
        `'${body.userid}'`,
        `'${datecreated}'`
    ];
}

function validateCreateValues(body) {
    try {
        let validation;
        validation = base.validateString('userid', body);
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