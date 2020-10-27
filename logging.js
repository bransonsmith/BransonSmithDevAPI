const rowLimit = 2;

function logSql(title, sql, sqlResponse) {
    console.log('---------------------------------------------------------');
    console.log(`Running SQL - ${title}`);
    console.log('--');
    console.log(sql);
    console.log('--');

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

function logRequest(req) {
    console.log('\n\n---------------------------------------------------------');
    console.log('Request Received:');
    console.log('--');
    console.log(`${req.method} ${req.url}`);
    console.log('---------------------------------------------------------');
    return true;
}

function logResponse(req, data) {
    console.log('---------------------------------------------------------');
    console.log(`Responding to ${req.method} ${req.url}`);
    console.log('--');
    console.log(`status: ${data.status}`);
    console.log('--');
    if (Array.isArray(data.result) && data.result.length > rowLimit) {
        console.log(`Found`, data.result.length, `rows. But only printing the first ${rowLimit}.`);
        console.log(data.result.slice(0, rowLimit));
        console.log('...');
    } else {
        console.log(data.result);
    }

    console.log('---------------------------------------------------------');
}

module.exports.logRequest = logRequest;
module.exports.logSql = logSql;
module.exports.logSqlError = logSqlError;
module.exports.logError = logError;
module.exports.logResponse = logResponse;