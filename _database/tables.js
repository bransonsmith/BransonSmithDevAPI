
const public_tables = ['sessions'];

function publicTableExists(table_name) {
    return public_tables.includes(table_name);
}

module.exports.public_tables = public_tables;
module.exports.publicTableExists = publicTableExists;