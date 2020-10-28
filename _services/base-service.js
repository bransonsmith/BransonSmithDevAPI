const db = require("../_database/db");
const common = require("../common");
const logging = require("../logging");
const tables = require("../_database/tables");
const baseModel = require('../_models/base-model');
const sqlStrings = require('../_database/sql-string-factory');
const fieldValidator = require('../_database/field-validator');

async function getAll(table_name, title=`Get all ${table_name}`) {
    const sql = `SELECT ${sqlStrings.getDtoFieldString(table_name)} FROM ${table_name};`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    
    const rows = dbResponse.result.rows;
    return { status: 200, result: rows }
}

async function getOne(table_name, id, title=`Get the ${table_name} for ${id}`) {
    const sql = `SELECT ${sqlStrings.getDtoFieldString(table_name)} FROM ${table_name} WHERE id = '${id}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }

    const rows = dbResponse.result.rows;
    if (rows.length < 1) {
        return { status: 404, result: common.notFoundMessage }
    }
    return { status: 200, result: rows[0] }
}

async function create(table_name, body, title=`Create new ${table_name}`) {
    const validationResponse = fieldValidator.validateCreateValues(table_name, body);
    if (validationResponse.status !== 200) { return validationResponse; }

    const fieldsThatMustExist = tables.getFieldsThatMustHaveAnExistingObject(table_name, body);
    const existenceResponse = await verifyExistence(fieldsThatMustExist);
    if (existenceResponse.status !== 200) { return existenceResponse; }
   
    const newId = baseModel.getNewId();
    const valuesString = sqlStrings.getCreateValuesString(table_name, body, newId);
    const createSql = `INSERT INTO ${table_name} VALUES (${valuesString});`;
    const createDbResponse = await db.executeSql(createSql, title);
    if (createDbResponse.status !== 200) { return createDbResponse; }

    try {
        return await getOne(table_name, newId);
    } catch (getError){
        logging.logError(`Get newly created ${table_name}`, getError);
        return { status: 200, result: {} }
    }
}

async function update(table_name, id, body, title=`Update ${table_name}`) {

    try {
        const existsResponse = await getOne(table_name, id, 'Get existing object to update.');
        if (existsResponse.status !== 200) { return { status: 409, result: `No existing ${table_name} found for the given id.` }; }
    } catch (getError){
        logging.logError(`Get updated ${table_name}`, getError);
        return { status: 200, result: {} }
    }

    const validationResponse = fieldValidator.validateUpdateValues(table_name, body);
    if (validationResponse.status !== 200) { return validationResponse; }
    
    const fieldsThatMustExist = tables.getFieldsThatMustHaveAnExistingObject(table_name, body);
    const existenceResponse = await verifyExistence(fieldsThatMustExist);
    if (existenceResponse.status !== 200) { return existenceResponse; }

    const valuesString = sqlStrings.getUpdateValuesString(table_name, body);
    const updateSql = `UPDATE ${table_name} SET ${valuesString} WHERE id = '${id}';`;
    const updateDbResponse = await db.executeSql(updateSql, title);
    if (updateDbResponse.status !== 200) { return updateDbResponse; }

    try {
        return await getOne(table_name, id, 'Get updated object.');
    } catch (getError){
        logging.logError(`Get updated ${table_name}`, getError);
        return { status: 200, result: {} }
    }
}

async function remove(table_name, id, title=`Delete ${table_name}`) {

}

async function getHome() {
    const sql = `SELECT 1;`;
    const dbResponse = await db.executeSql(sql, 'Get Home');
    if (dbResponse.status !== 200) { return dbResponse; }

    return { status: 200, result: 'BransonSmithDevAPI is live :)' }
}

async function verifyExistence(fieldsObjects) {
    for (let i = 0; i < fieldsObjects.length; i++) {
        const fieldObject = fieldsObjects[i];
        const existsResponse = await getOne(fieldObject.field.table, fieldObject.value, `Verify existence of ${fieldObject.field.table}`);
        if (existsResponse.status !== 200) { return { status: 409, result: `No existing object found for the given ${fieldObject.field.name}.` }; }
    }
    return { status: 200, result: `` }
}

async function dropTable(table_name, title=`Drop ${table_name} Table`) {
    const sql = `DROP TABLE ${table_name};`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    return { status: 200, result: `Dropped ${table_name}.` }
}

async function initTable(table_name, title=`Create ${table_name} Table`) {
    const sql = `CREATE TABLE ${table_name} (${sqlStrings.getCreateTableFieldString(table_name)});`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    return { status: 200, result: `Created ${table_name}.` }
}

module.exports.getAll = getAll;
module.exports.getOne = getOne;
module.exports.create = create;
module.exports.update = update;
module.exports.dropTable = dropTable;
module.exports.initTable = initTable;
module.exports.getHome = getHome;