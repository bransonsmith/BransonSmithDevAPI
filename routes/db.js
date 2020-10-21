const express = require("express");
const common = require("../common")
let router = express.Router();

const { Client } = require('pg');
const client = new Client({
  connectionString: common.dev_data,
  ssl: true,
});
client.connect();

router.get('/test', (req, response) => {
    const sql = `SELECT 1 + 1;`;
    common.logReq(req, 'GET', '/test', sql);

    client.query(sql).then(res => {
        const result = res.rows[0];
        response.status(200).send(`Succesfully got result: ${result}`); return;
    }).catch(err => {
        console.log(err.stack);
        response.status(400).send(err); return;
    }).finally(() => {});
});

module.exports = router;