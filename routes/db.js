const express = require("express");
let router = express.Router();

const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://tkjzlquhwdldho:1371bf16ec2de194e2e5cb22988b09bf3f4b2cce028643fceb2907a8eecbb335@ec2-54-156-53-71.compute-1.amazonaws.com:5432/d82csaggb6g7aa',
  ssl: true,
});
client.connect();


router.get('/test', (req, response) => {
    const sql = `SELECT 1 + 1;`;
    logReq(req, 'GET', '/test', sql);

    client.query(sql).then(res => {
        const result = res.rows[0];
        response.status(200).send(`Succesfully got result: ${result}`); return;
    }).catch(err => {
        console.log(err.stack);
        response.status(400).send(err); return;
    }).finally(() => {});
});

function logReq(req, action, route, sql='') {
    console.log('\n---------------------------------------------------------\n');
    console.log(`Request Found: ${action} ${route}`);
    console.log(`\n----\n`);
    console.log(`${req}`);
    console.log(`\n----\n`);
    console.log(`${sql}`);
    console.log('---------------------------------------------------------');
}

module.exports = router;