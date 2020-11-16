const models = require("../model-service");
const lableService = require("./label-service");
const baseService = require("../base-service");
const logging = require("../../logging");

const table_name = 'transactions';

async function fromcsv(body, title=`Add transaction from csv`) {

    // const labelsResponse = await baseService.getAll('labels');
    // if (labelsResponse.status !== 200) { return labelsResponse; }

    const model = models.getModelForTable(table_name);

    let newTransactions = [];
    const transactions = body.transactions;
    console.log(`Transactions: \n${transactions}`);
    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        const validateCsvModel = model.fromcsvSchema.validate(transaction);
        if (validateCsvModel.error !== null) {
            logging.logError('Transaction from csv create validation', validateCsvModel.error);
            // return { status: 409, result: { message: `${validateCsvModel.error}`} };
        } else {
            const labelResponse = await lableService.getLabelByDetails(transaction.details);
            if (labelResponse.status !== 200) {
                transaction.labelid = '';
                transaction.categoryid = '';
            } else {
                transaction.labelid    = labelResponse.result.id;
                transaction.categoryid = labelResponse.result.categoryid;
            }

            newTransactions.push(await baseService.create(table_name, transaction).result);
        }
    }

    return { status: 200, result: newTransactions };
}

async function getFilledOutTransactions(title='Get filled out transaction') {

    const transactionsResponse = await baseService.getAll('transactions');
    if (transactionsResponse.status !== 200) { return transactionsResponse; }
    const labelsResponse = await baseService.getAll('labels');
    if (labelsResponse.status !== 200) { return labelsResponse; }
    const categoriesResponse = await baseService.getAll('categories');
    if (categoriesResponse.status !== 200) { return categoriesResponse; }

    const baseTransactions = transactionsResponse.result;
    const labels = labelsResponse.result;
    const categories = categoriesResponse.result;

    let filledOutTransactions = [];
    for (let i = 0; i < baseTransactions.length; i++) {
        let transaction = baseTransactions[i];
        if (transaction.labelid !== undefined && transaction.labelid !== '') {
            transaction.label = labels.find(l => l.id === transaction.labelid);
        } else { transaction.label = { id: '', name: '', autokey: '', categoryid: '' }; }
        if (transaction.categoryid !== undefined && transaction.categoryid !== '') {
            transaction.category = categories.find(l => l.id === transaction.categoryid);
        } else { transaction.category = { id: '', name: '' }; }
        filledOutTransactions.push(transaction);
    }
    return { status: 200, result: filledOutTransactions };
}

async function getFilledOutTransactionsForMonth(month, title='Get filled out transaction for month') {

    const transactionsResponse = await baseService.getAll('transactions');
    if (transactionsResponse.status !== 200) { return transactionsResponse; }
    const labelsResponse = await baseService.getAll('labels');
    if (labelsResponse.status !== 200) { return labelsResponse; }
    const categoriesResponse = await baseService.getAll('categories');
    if (categoriesResponse.status !== 200) { return categoriesResponse; }

    const baseTransactions = transactionsResponse.result.filter(t => t.month === month);
    const labels = labelsResponse.result;
    const categories = categoriesResponse.result;

    let filledOutTransactions = [];
    for (let i = 0; i < baseTransactions.length; i++) {
        let transaction = baseTransactions[i];
        if (transaction.labelid !== undefined && transaction.labelid !== '') {
            transaction.label = labels.find(l => l.id === transaction.labelid);
        } else { transaction.label = { id: '', name: '', autokey: '', categoryid: '' }; }
        if (transaction.categoryid !== undefined && transaction.categoryid !== '') {
            transaction.category = categories.find(l => l.id === transaction.categoryid);
        } else { transaction.category = { id: '', name: '' }; }
        filledOutTransactions.push(transaction);
    }
    return { status: 200, result: filledOutTransactions };
}

module.exports.fromcsv = fromcsv;
module.exports.getFilledOutTransactions = getFilledOutTransactions;
module.exports.getFilledOutTransactionsForMonth = getFilledOutTransactionsForMonth;