prod_data = 'postgres://gkizmntppsohxf:732468407a55e524d7374c0037a4c789fd73529904f7e04224ee8f4a09988ff3@ec2-54-160-202-3.compute-1.amazonaws.com:5432/d4bnfos91oui4s';
dev_data = 'postgres://tkjzlquhwdldho:1371bf16ec2de194e2e5cb22988b09bf3f4b2cce028643fceb2907a8eecbb335@ec2-54-156-53-71.compute-1.amazonaws.com:5432/d82csaggb6g7aa'

connection_string = dev_data;

function logReq(req, action, route, sql='') {
    console.log('---------------------------------------------------------\n');
    console.log('Request Found: \n');
    console.log('---------------------------------------------------------\n');
    console.log(`${action} ${route}`);
    console.log(`\n----\n`);
    console.log(`${sql}\n`);
    console.log('---------------------------------------------------------');
    return;
}

export const connection_string = connection_string;
const _logReq = logReq;
export { _logReq as logReq };