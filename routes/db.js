const express = require("express");
let router = express.Router();

const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://jptlnpgqxmpysv:4e82e76ffd96c11ef7a90f6051c5e1f63ec8990c698631832005d83d1296b299@ec2-54-225-173-42.compute-1.amazonaws.com:5432/d1uak9466uurk7',
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