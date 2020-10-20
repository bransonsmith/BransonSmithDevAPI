const express = require("express");
let router = express.Router();

const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://tkjzlquhwdldho:1371bf16ec2de194e2e5cb22988b09bf3f4b2cce028643fceb2907a8eecbb335@ec2-54-156-53-71.compute-1.amazonaws.com:5432/d82csaggb6g7aa',
  ssl: true,
});
client.connect();


router.get('/test', (req, response) => {
    const sql = ```
        SELECT 1 + 1;
    ```;
    await this.logReq('GET', '/test', sql);

    client.query(sql).then(res => {
        const result = res.rows[0];
        response.status(200).send(`Succesfully got result: ${result}`); return;
    }).catch(err => {
        console.log(err.stack);
        response.status(400).send(err); return;
    }).finally(() => {});
});

async function logReq(action, route, sql='') {
    console.log('\n---------------------------------------------------------\n');
    console.log(`Request Found: ${action} ${route}`);
    console.log(`${sql}`);
    console.log('---------------------------------------------------------');
}