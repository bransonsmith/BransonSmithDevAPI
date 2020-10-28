const models = require('../_services/model-service');

const public_tables = [
    { name: 'sessions', getOne: true , getAll: true , create: true , update: true , remove: true , initTable: false, dropTable: false },
    { name: 'users',    getOne: true , getAll: true , create: true , update: true , remove: true , initTable: false, dropTable: false },
];

function routeIsPublic(table_name, routeName) {
    for (let i = 0; i < public_tables.length; i++) {
        const table = public_tables[i];
        if (table.name === table_name) {
            return table[routeName];
        }
    }
    return false;
}

function getFieldsThatMustHaveAnExistingObject(table_name, body) {
    try {
        const fields = models.getModelForTable(table_name).all_fields.filter(f => f.mustHaveExistingObject);
        let finalList = [];
        fields.forEach(f => {
            const value = body[f.name];
            finalList.push({field: f, value: value});
        });
        return finalList;
    } catch {
        return [];
    }
}

module.exports.public_tables = public_tables;
module.exports.routeIsPublic = routeIsPublic;
module.exports.getFieldsThatMustHaveAnExistingObject = getFieldsThatMustHaveAnExistingObject;