const baseService = require("../base-service");
const incomeService = require("./income-service");
const targetService = require("./target-service");
const transactionService = require("./transaction-service");
const budgetedMonthService = require("./budgeted-month-service");

const table_name = 'budgets';

async function getFilledOutBudgetedMonth(budgetid, month, title='Get filled out budgeted month') {

    const budgetResponse = await baseService.getOne(table_name, budgetid);
    if (budgetResponse.status !== 200) { return budgetResponse; }
    const budget = budgetResponse.result;

    const budgetedMonthResponse = await budgetedMonthService.getBudgetedMonthByMonth(budgetid, month);
    if (budgetedMonthResponse.status !== 200) { return budgetedMonthResponse; }
    const budgetedMonth = budgetedMonthResponse.result;

    const incomesResponse = await incomeService.getIncomesByBudgetedMonth(budgetedMonth.id);
    if (incomesResponse.status !== 200) { return incomesResponse; }
    const incomes = incomesResponse.result;

    const targetsResponse = await targetService.getTargetsForIncomes(incomes.map(i => i.id));
    if (targetsResponse.status !== 200) { return targetsResponse; }
    const targets = targetsResponse.result;

    const transactionsResponse = await transactionService.getFilledOutTransactionsForMonth(month);
    if (transactionsResponse.status !== 200) { return transactionsResponse; }
    const transactions = transactionsResponse.result;
    
    const categoriesResponse = await baseService.getAll('categories');
    if (categoriesResponse.status !== 200) { return categoriesResponse; }
    const categories = categoriesResponse.result;

    const targetSummaries = await getSummarizedTargetsForMonth(budgetedMonth, targets, transactions, categories);

    const filledOutBudgetedMonth = {
        month: month,
        budget: budget,
        incomes: incomes,
        targetsummaries: targetSummaries,
    };
    return { status: 200, result: filledOutBudgetedMonth };
}

async function getSummarizedTargetsForMonth(budgetedMonth, targets, transactions, categories) {

    let untargeted = {
        category: { id: '', name: 'No target to get category from' },
        target: { id: '', name: 'No target' },
        actualamount: 0,
        transactions: []
    }
    targetSummaries = [];

    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const category = categories.find(c => c.id === target.categoryid);
        targetSummaries.push({ category: category, target: target, actualamount: 0, transactions: [] });
    }

    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        let known = false;
        for (let i = 0; i < targetSummaries.length; i++) {
            const targetSummary = targetSummaries[i];
            if (targetSummary.category.id === transaction.categoryid) {
                targetSummary.transactions.push(transaction);
                targetSummary.actualamount = parseFloat(targetSummary.actualamount.toString()) + parseFloat(transaction.amount.toString());
                known = true;
            }
        }
        if (!known) {
            untargeted.transactions.push(transaction);
            untargeted.actualamount = parseFloat(untargeted.actualamount.toString()) + parseFloat(transaction.amount.toString());
        }
    }
    targetSummaries.push(untargeted);
    return targetSummaries;
}


module.exports.getFilledOutBudgetedMonth = getFilledOutBudgetedMonth;