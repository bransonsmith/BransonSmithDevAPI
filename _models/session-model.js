const base = require('./base-model');

const table_name = 'sessions';
const all_fields = [
    { name: 'id',            type: 'varchar(255)',  attributes: 'NOT NULL PRIMARY KEY', mustExistOnCreate: false, table: ''      },
    { name: 'expiration',    type: 'timestamp',     attributes: 'NOT NULL',             mustExistOnCreate: false, table: ''      },
    { name: 'token',         type: 'varchar(255)',  attributes: 'NOT NULL',             mustExistOnCreate: false, table: ''      },
    { name: 'userid',        type: 'varchar(255)',  attributes: 'NOT NULL',             mustExistOnCreate: true , table: 'users' },
    { name: 'datecreated',   type: 'timestamp',     attributes: '',                     mustExistOnCreate: false, table: ''      },
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
        let valid = true;
        const userId = body.userid;
        if (userId === undefined) { return { status: 409, result: 'Missing string: userid'}; }
        
        valid = (typeof userId) === 'string';
        if (!valid) { return { status: 409, result: 'userid should be of type string'}; }
        return { status: 200, result: '' };
    } catch {
        return { status: 409, result: 'Missing string: userid'};
    }
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.validateCreateValues = validateCreateValues;