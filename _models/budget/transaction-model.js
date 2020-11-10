const Joi = require('joi');

const table_name = 'transactions';
const all_fields = [
    { name: 'id',         type: 'varchar(255)', attributes: 'NOT NULL PRIMARY KEY', mustHaveExistingObject: false, table: ''          , onDto: true , createField: false, updateField: false, optional: false },
    { name: 'labelid',    type: 'varchar(255)', attributes: ''                    , mustHaveExistingObject: true , table: 'labels'    , onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'categoryid', type: 'varchar(255)', attributes: ''                    , mustHaveExistingObject: true , table: 'categories', onDto: true , createField: true , updateField: true , optional: false },
    { name: 'date',       type: 'varchar(255)', attributes: 'NOT NULL'            , mustHaveExistingObject: false, table: ''          , onDto: true , createField: true , updateField: true , optional: false },
    { name: 'details',    type: 'varchar(255)', attributes: 'NOT NULL'            , mustHaveExistingObject: false, table: ''          , onDto: true , createField: true , updateField: true , optional: false },
    { name: 'amount',     type: 'decimal',      attributes: 'NOT NULL'            , mustHaveExistingObject: false, table: ''          , onDto: true , createField: true , updateField: true , optional: false },
    { name: 'month',      type: 'varchar(255)', attributes: ''                    , mustHaveExistingObject: false, table: ''          , onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'card',       type: 'varchar(255)', attributes: ''                    , mustHaveExistingObject: false, table: ''          , onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'notes',      type: 'varchar(255)', attributes: ''                    , mustHaveExistingObject: false, table: ''          , onDto: true , createField: true , updateField: true , optional: true  },
    { name: 'tags',       type: 'varchar(255)', attributes: ''                    , mustHaveExistingObject: false, table: ''          , onDto: true , createField: true , updateField: true , optional: true  }
];

const months = [
    'None', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
]

const createSchema = Joi.object({
    labelid: Joi.string().allow('').max(255),
    categoryid: Joi.string().allow('').max(255),
    date: Joi.string().required().max(255),
    details: Joi.string().required().max(255),
    amount: Joi.number().required(),
    month: Joi.string().allow('').max(255),
    card: Joi.string().allow('').max(255),
    notes: Joi.string().allow('').max(255),
    tags: Joi.string().allow('').max(255),
});
const updateSchema = Joi.object({
    labelid: Joi.string().allow('').max(255),
    categoryid: Joi.string().allow('').max(255),
    date: Joi.string().required().max(255),
    details: Joi.string().required().max(255),
    amount: Joi.number().required(),
    month: Joi.string().allow('').max(255),
    card: Joi.string().allow('').max(255),
    notes: Joi.string().allow('').max(255),
    tags: Joi.string().allow('').max(255)
});

const fromcsvSchema = Joi.object({
    date: Joi.string().required().max(255),
    details: Joi.string().required().max(255),
    amount: Joi.number().required(),
});

function getCreateValues(body, newId) {

    const date = getDate(body.date, body.details);
    const month = getMonth(body.month, date);
    const card  = getCard(body.card, body.details);

    let labelid = body.labelid;
    if (labelid === undefined) { labelid = '' }

    return [
        `'${newId}'`,
        `'${labelid}'`,
        `'${body.categoryid}'`,
        `'${date}'`,
        `'${body.details}'`,
        `${body.amount}`,
        `'${month}'`,
        `'${card}'`,
        `'${body.notes}'`,
        `'${body.tags}'`
    ];
}

function getDate(date, details) {
    if (details.includes('PURCHASE AUTHORIZED ON ')) {
        const trimmed = details.replace('PURCHASE AUTHORIZED ON ', '');
        const detDate = trimmed.split(' ')[0];
        return detDate + '/' +  date.split('/')[2];
    }
    return date;
}

function getMonth(month, date) {
    if (month !== undefined && month !== '') { return month; }
    return months[parseInt(date.split('/')[0])] + ' ' + date.split('/')[2];
}

function getCard(card, details) {
    if (card !== undefined && card !== '') { return card; }
    if ((new RegExp('CARD [0-9][0-9][0-9][0-9]$')).test(details)) {
        return details.substring(details.length - 4);
    }
    return '';
}

module.exports.table_name    = table_name;
module.exports.all_fields    = all_fields;
module.exports.getCreateValues = getCreateValues;
module.exports.createSchema = createSchema;
module.exports.updateSchema = updateSchema;
module.exports.fromcsvSchema = fromcsvSchema;