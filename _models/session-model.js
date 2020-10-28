const base = require('./base-model');

const table_name = 'sessions';
const all_fields = [
    { name: 'id',            type: 'varchar(255)',  attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: ''     , onDto: true , updateField: false, createField: false },
    { name: 'expiration',    type: 'timestamp',     attributes: 'NOT NULL',             mustHaveExistingObject: false, table: ''     , onDto: false, updateField: false, createField: false },
    { name: 'token',         type: 'varchar(255)',  attributes: 'NOT NULL',             mustHaveExistingObject: false, table: ''     , onDto: true , updateField: false, createField: false },
    { name: 'userid',        type: 'varchar(255)',  attributes: 'NOT NULL',             mustHaveExistingObject: true , table: 'users', onDto: true , updateField: false, createField: true  },
    { name: 'datecreated',   type: 'timestamp',     attributes: '',                     mustHaveExistingObject: false, table: ''     , onDto: false, updateField: false, createField: false },
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

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;