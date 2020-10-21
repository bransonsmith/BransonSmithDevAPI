const connection_string = 'postgres://tkjzlquhwdldho:1371bf16ec2de194e2e5cb22988b09bf3f4b2cce028643fceb2907a8eecbb335@ec2-54-156-53-71.compute-1.amazonaws.com:5432/d82csaggb6g7aa';

function logReq(req, action, route, sql='') {
    console.log('---------------------------------------------------------\n');
    console.log('Request Found: \n');
    console.log('---------------------------------------------------------\n');
    console.log(`${action} ${route}`);
    console.log(`\n----\n`);
    console.log(`${sql}\n`);
    console.log('---------------------------------------------------------');
    return true;
}

module.exports.connection_string = connection_string;
module.exports.logReq = logReq;