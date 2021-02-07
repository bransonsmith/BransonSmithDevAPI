const models = require('../_services/model-service');

/* New Model/Table Addition Process 
    1. Add to public tables
    2. Define model
    3. Implement getCreateValues on model
    3. Put model in the Model Service
*/

const public_tables = [
    { name: 'sessions',             getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true,  dropTable: true  },
    { name: 'users',                getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true,  dropTable: true  },
    { name: 'projects',             getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'transactions',         getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'categories',           getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'labels',               getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'budgets',              getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'budgetedmonths',       getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'incomes',              getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'targets',              getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'discgolfrounds',       getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'discgolfplayers',      getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'discgolfcourses',      getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'discgolfplayerrounds', getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'discgolfholes',        getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
    { name: 'discgolfplayerholes',  getOne: true , getAll: true , create: true , update: true , remove: true , initTable: true , dropTable: true  },
];

function routeIsPublic(table_name, routeName) {
    for (let i = 0; i < public_tables.length; i++) {
        const table = public_tables[i];
        if (table.name === table_name) {
            return table[routeName];
        }
    }
    return false;
}

function getFieldsThatMustHaveAnExistingObject(table_name, body) {
    try {
        const fields = models.getModelForTable(table_name).all_fields.filter(f => f.mustHaveExistingObject);
        let finalList = [];
        fields.forEach(f => {
            const value = body[f.name];
            finalList.push({field: f, value: value});
        });
        console.log('Fields that require an existing object: ')
        console.log(finalList);
        return finalList;
    } catch {
        return [];
    }
}

module.exports.public_tables = public_tables;
module.exports.routeIsPublic = routeIsPublic;
module.exports.getFieldsThatMustHaveAnExistingObject = getFieldsThatMustHaveAnExistingObject;