const db = require("../_database/db");
const common = require("../common");
const logging = require("../logging");
const tables = require("../_database/tables");
const baseModel = require('../_models/base-model');

async function getAll(table_name, title=`Get all ${table_name}`) {
    const sql = `SELECT * FROM ${table_name};`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }
    
    const rows = dbResponse.result.rows;
    return { status: 200, result: rows }
}

async function getOne(table_name, id, title=`Get the ${table_name} for ${id}`) {
    const sql = `SELECT * FROM ${table_name} WHERE id = '${id}';`;
    const dbResponse = await db.executeSql(sql, title);
    if (dbResponse.status !== 200) { return dbResponse; }

    const rows = dbResponse.result.rows;
    if (rows.length < 1) {
        return { status: 404, result: common.notFoundMessage }
    }
    return { status: 200, result: rows[0] }
}

async function create(table_name, body, title=`Create new ${table_name}`) {

    const validationResponse = tables.validateCreateValues(table_name, body);
    if (validationResponse.status !== 200) { return validationResponse; }

    const createFieldsThatMustExist = tables.getFieldsThatMustExist(table_name, body);
    const existenceResponse = await verifyExistence(createFieldsThatMustExist);
    console.log('existenceResponse');
    console.log(existenceResponse);
    if (existenceResponse.status !== 200) { return existenceResponse; }
   
    const newId = baseModel.getNewId();
    const valuesString = tables.getCreateValuesString(table_name, body, newId);
    const createSql = `INSERT INTO ${table_name} VALUES (${valuesString});`;
    const createDbResponse = await db.executeSql(createSql);
    if (createDbResponse.status !== 200) { return createDbResponse; }

    try {
        return await getOne(table_name, newId);
    } catch (getError){
        logging.logError(`Get newly created ${table_name}`, getError);
        return { status: 200, result: {} }
    }
}

async function verifyExistence(fieldsObjects) {

    for (let i = 0; i < fieldsObjects.length; i++) {
        const fieldObject = fieldsObjects[i];
        const existsResponse = await getOne(fieldObject.field.table, fieldObject.value, `Verify existence of ${fieldObject.field.table}`);
        if (existsResponse.status !== 200) { return { status: 409, result: `No existing object found for the given ${fieldObject.field.name}.` }; }
    }

    return { status: 200, result: `` }
}

module.exports.getAll = getAll;
module.exports.getOne = getOne;
module.exports.create = create;