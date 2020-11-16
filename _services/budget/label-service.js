const baseService = require("../base-service");

const table_name = 'labels';

async function getLabelByDetails(details, title=`Get label by details`) {

    const labelsResponse = await baseService.getAll(table_name);
    if (labelsResponse.status !== 200) { return labelsResponse; }
    const labels = labelsResponse.result;

    for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        const keys = [];
        if (autokeys.length > 0) {
            keys = label.autokeys.split(',');
            for (let j = 0; j < keys.length; j++) {
                const autokey = keys[j];
                if (details.includes(autokey)) {
                    return { status: 200, result: label };
                }
            }
        }
    }
    return { status: 409, result: { message: 'No label matched the details.' } };
}

async function getFilledOutLabels(title='Get filled out label') {

    const labelsResponse = await baseService.getAll('labels');
    if (labelsResponse.status !== 200) { return labelsResponse; }
    const categoriesResponse = await baseService.getAll('categories');
    if (categoriesResponse.status !== 200) { return categoriesResponse; }

    const labels = labelsResponse.result;
    const categories = categoriesResponse.result;

    let filledOutLabels = [];
    for (let i = 0; i < labels.length; i++) {
        let label = labels[i];
        if (label.categoryid !== undefined && label.categoryid !== '') {
            label.category = categories.find(c => c.id === label.categoryid);
        } else { label.category = { id: '', name: '' }; }
        filledOutLabels.push(label);
    }
    return { status: 200, result: filledOutLabels };
}

module.exports.getLabelByDetails = getLabelByDetails;
module.exports.getFilledOutLabels = getFilledOutLabels;