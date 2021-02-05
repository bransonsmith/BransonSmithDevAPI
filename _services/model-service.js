const sessionModel = require("../_models/session-model");
const userModel = require("../_models/user-model");
const projectModel = require("../_models/project-model");
const transactionModel = require("../_models/budget/transaction-model");
const categoryModel = require("../_models/budget/category-model");
const labelModel = require("../_models/budget/label-model");
const budgetModel = require("../_models/budget/budget-model");
const budgetedMonthModel = require("../_models/budget/budgeted-month-model");
const incomeModel = require("../_models/budget/income-model");
const targetModel = require("../_models/budget/target-model");
const discgolfRoundModel = require("../_models/discgolf/round-model");
const discgolfCourseModel = require("../_models/discgolf/course-model");
const discgolfPlayerModel = require("../_models/discgolf/player-model");
const discgolfPlayerRoundModel = require("../_models/discgolf/player-round-model");
const discgolfHoleModel = require("../_models/discgolf/hole-model");
const discgolfPlayerHoleModel = require("../_models/discgolf/player-hole-model");

function getModelForTable(table_name) {
    switch (table_name) {
        case 'sessions':             return sessionModel;
        case 'users':                return userModel;
        case 'projects':             return projectModel;
        case 'transactions':         return transactionModel;
        case 'categories':           return categoryModel;
        case 'labels':               return labelModel;
        case 'budgets':              return budgetModel;
        case 'budgetedmonths':       return budgetedMonthModel;
        case 'incomes':              return incomeModel;
        case 'targets':              return targetModel;
        case 'discgolfrounds':       return discgolfRoundModel;
        case 'discgolfplayers':      return discgolfPlayerModel;
        case 'discgolfcourses':      return discgolfCourseModel;
        case 'discgolfplayerrounds': return discgolfPlayerRoundModel;
        case 'discgolfholes':        return discgolfHoleModel;
        case 'discgolfplayerholes':  return discgolfPlayerHoleModel;
        default:                     return null;
    }
}

module.exports.getModelForTable = getModelForTable;