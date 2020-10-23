const express = require("express");
const uuidv1 = require('uuid/v1');
const common = require("../common")
let router = express.Router();
const db = require('./db');
const moment = require('moment');

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

async function create(table_name, fields, createValues, newId) {
    try {
        var dbResponse = await db.create(table_name, fields, createValues);
        if (dbResponse.status === 'Success') {
            var getNewItemResponse = await db.getOne(table_name, newId);
            return await handleDbResponse(getNewItemResponse, response);
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