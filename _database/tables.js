const models = require('../_services/model-service');

const public_tables = ['sessions', 'users'];

function publicTableExists(table_name) {
    return public_tables.includes(table_name);
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
module.exports.publicTableExists = publicTableExists;
module.exports.getFieldsThatMustHaveAnExistingObject = getFieldsThatMustHaveAnExistingObject;