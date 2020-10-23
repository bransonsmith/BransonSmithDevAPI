const connection_string = 'postgres://tkjzlquhwdldho:1371bf16ec2de194e2e5cb22988b09bf3f4b2cce028643fceb2907a8eecbb335@ec2-54-156-53-71.compute-1.amazonaws.com:5432/d82csaggb6g7aa';

function logReq(action, route) {
    console.log('\n\n---------------------------------------------------------');
    console.log('Request Received:');
    console.log('--');
    console.log(`${action} ${route}`);
    console.log('---------------------------------------------------------');
    return true;
}

function logSql(title, sql) {
    console.log('---------------------------------------------------------');
    console.log(`Running SQL: ${title}`);
    console.log('--');
    console.log(sql);
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
module.exports.logError = logError;
module.exports.logResponse = logResponse;