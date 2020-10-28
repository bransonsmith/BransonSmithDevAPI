const base = require('./base-model');

const table_name = 'projects';
const all_fields = [
    { name: 'id',            type: 'varchar(255)',  attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: '', onDto: true , createField: false, updateField: false },
    { name: 'title',         type: 'varchar(255)',  attributes: 'NOT NULL'            , mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true  },
    { name: 'codelink',      type: 'varchar(255)',  attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true  },
    { name: 'examplelink',   type: 'varchar(255)',  attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true  },
    { name: 'text',          type: 'varchar(4000)', attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true  },
    { name: 'image',         type: 'varchar(1000)', attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: true , createField: true , updateField: true  },
    { name: 'createddate',   type: 'timestamp',     attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: false, createField: false, updateField: false },
    { name: 'codeclicks',    type: 'int',           attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: false, createField: false, updateField: false },
    { name: 'exampleclicks', type: 'int',           attributes: ''                    , mustHaveExistingObject: false, table: '', onDto: false, createField: false, updateField: false }
];

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