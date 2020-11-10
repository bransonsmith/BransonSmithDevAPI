const sessionModel = require("../_models/session-model");
const userModel = require("../_models/user-model");
const projectModel = require("../_models/project-model");
const transactionModel = require("../_models/budget/transaction-model");
const categoryModel = require("../_models/budget/category-model");
const labelModel = require("../_models/budget/label-model");

function getModelForTable(table_name) {
    switch (table_name) {
        case 'sessions':        return sessionModel;
        case 'users':           return userModel;
        case 'projects':        return projectModel;
        case 'transactions':    return transactionModel;
        case 'categories':      return categoryModel;
        case 'labels':          return labelModel;
        case 'budgets':          return labelModel;
        case 'budgetedmonths':          return labelModel;
        case 'incomes':          return labelModel;
        case 'targets':          return labelModel;
        default:                return null;
    }
}

module.exports.getModelForTable = getModelForTable;