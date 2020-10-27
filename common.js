//deep
const prod_connection_string = 'postgres://tkjzlquhwdldho:1371bf16ec2de194e2e5cb22988b09bf3f4b2cce028643fceb2907a8eecbb335@ec2-54-156-53-71.compute-1.amazonaws.com:5432/d82csaggb6g7aa';

// fluffy
const dev_connection_string = 'postgres://gkizmntppsohxf:732468407a55e524d7374c0037a4c789fd73529904f7e04224ee8f4a09988ff3@ec2-54-160-202-3.compute-1.amazonaws.com:5432/d4bnfos91oui4s';

var env = process.argv[2] || 'prod';
switch (env) {
    case 'dev':
        connection_string = dev_connection_string;
        break;
    case 'prod':
        connection_string = prod_connection_string;
        break;
}
console.log(`Starting as ${env} environment.`);
console.log(connection_string);

function logReq(action, route) {
    console.log('\n\n---------------------------------------------------------');
    console.log('Request Received:');
    console.log('--');
    console.log(`${action} ${route}`);
    console.log('---------------------------------------------------------');
    return true;
}

function logSql(title, sql, sqlResponse) {
    console.log('---------------------------------------------------------');
    console.log(`Running SQL - ${title}`);
    console.log('--');
    console.log(sql);
    console.log('--');

    const rowLimit = 2;
    if (sqlResponse.rowCount > rowLimit) {
        console.log(`Found`, sqlResponse.rowCount, `rows. But only printing the first ${rowLimit}.`);
        console.log(sqlResponse.rows.slice(0, rowLimit));
        console.log('...');
    } else {
        console.log(sqlResponse.rows);
    }
    console.log('---------------------------------------------------------');
}

function logSqlError(title, sql, sqlError) {
    console.log('---------------------------------------------------------');
    console.log(`Error Running SQL - ${title}`);
    console.log('--');
    console.log(sql);
    console.log('--');
    console.log(sqlError);
    console.log('---------------------------------------------------------');
}


function logError(title, err) {
    console.log('---------------------------------------------------------');
    console.log(`Error from ${title}`);
    console.log('--');
    console.log(err);
    console.log('---------------------------------------------------------');
}

function logResponse(title, response) {
    console.log('---------------------------------------------------------');
    console.log(`Response from ${title}`);
    console.log('--');
    if (Array.isArray(response) && response.length > 3) {
        console.log(response.slice(0, 3));
        console.log('...');
    } else {
        console.log(response);
    }
    console.log('---------------------------------------------------------');
}

module.exports.connection_string = connection_string;
module.exports.logReq = logReq;
module.exports.logSql = logSql;
module.exports.logSqlError = logSqlError;
module.exports.logError = logError;
module.exports.logResponse = logResponse;
module.exports.notFoundMessage = 'The requested resource does not exist.';
module.exports.badRequestMessage = 'Could not process request.';