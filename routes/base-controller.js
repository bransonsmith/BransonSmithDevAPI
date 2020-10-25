const common = require("../common")
const db = require('./db');

async function createTable(table_name, fields, req, response) {
    try {
        db.createTable(table_name, fields).then(dbResponse => {
            if (dbResponse.status === 'Success') {
                response.status(200).send(`Created ${table_name}`); return `Created ${table_name}`;
            } else {
                response.status(400).send(`Failed to create ${table_name}: ${dbResponse.result}`); return dbResponse.result;
            }
        }).catch(dbError => {
            throw dbError;
        });
    } catch (dbError) {
        handleDbError(dbError, response);
    }
}

async function dropTable(table_name, req, response) {
    try {
        db.dropTable(table_name).then(dbResponse => {
            if (dbResponse.status === 'Success') {
                response.status(200).send(`Dropped ${table_name}`); return `Dropped ${table_name}`;
            } else {
                response.status(400).send(`Failed to drop ${table_name}: ${dbResponse.result}`); return dbResponse.result;
            }
        }).catch(dbError => {
            throw dbError;
        });
    } catch (dbError) {
        handleDbError(dbError, response);
    }
}

async function getAll(table_name, req, response) {
    try {
        var dbResponse = await db.getAll(table_name);
        return await handleDbResponse(dbResponse, response);
    } catch (dbError) {
        await handleDbError(dbError, response);
    }
}

async function getOne(table_name, req, response) {
    try {
        var dbResponse = await db.getOne(table_name, req.params.id);
        return await handleDbResponse(dbResponse, response);
    } catch (dbError) {
        await handleDbError(dbError, response);
    }
}

async function getOneByACriteria(table_name, criteria_value, criteria_field, req, response) {
    try {
        var dbResponse = await db.getOneByACriteria(table_name, criteria_value, criteria_field);
        return await handleDbResponse(dbResponse, response);
    } catch (dbError) {
        await handleDbError(dbError, response);
    }
}

async function create(table_name, fields, createValues, newId, response) {
    try {
        var dbResponse = await db.create(table_name, fields, createValues);
        if (dbResponse.status === 'Success') {
            var getNewItemResponse = await db.getOne(table_name, newId);
            return await handleDbResponse(getNewItemResponse, response);
        } else {
            if (dbResponse.status === 'Error') {
                if (dbResponse.result.includes('error: duplicate key value violates unique constraint "users_username_key"')) {
                    response.status(409).send('The username already exists.'); return dbResponse.result;
                }
            }
            response.status(400).send(dbResponse.result);
            return dbResponse.result;
        }
    } catch (dbError) {
        await handleDbError(dbError, response);
    }
}

async function update(table_name, fields, updateValues, id, response) {
    try {
        var dbResponse = await db.update(table_name, id, fields, updateValues);
        if (dbResponse.status === 'Success') {
            var getUpdatedItemResponse = await db.getOne(table_name, id);
            return await handleDbResponse(getUpdatedItemResponse, response);
        } else {
            response.status(400).send(dbResponse.result);
            return dbResponse.result;
        }
    } catch (dbError) {
        await handleDbError(dbError, response);
    }
}

async function handleDbError(dbError, response) {
    common.logError('Database', dbError);
    response.status(400).send(dbError);
}

async function handleDbResponse(dbResponse, response) {
    if (dbResponse && dbResponse.status === 'Success') {
        response.status(200).send(dbResponse.result);
        return dbResponse.result;
    } else {
        response.status(400).send(dbResponse.result);
        return dbResponse.result;
    }
}

module.exports.createTable = createTable;
module.exports.dropTable = dropTable;
module.exports.getAll = getAll;
module.exports.getOne = getOne;
module.exports.create = create;
module.exports.update = update;
module.exports.getOneByACriteria = getOneByACriteria;