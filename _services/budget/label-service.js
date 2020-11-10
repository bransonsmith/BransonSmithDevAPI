const baseService = require("../base-service");

const table_name = 'labels';

async function getLabelByDetails(details, title=`Get label by details`) {

    const labelsResponse = await baseService.getAll(table_name);
    if (labelsResponse.status !== 200) { return labelsResponse; }
    const labels = labelsResponse.result;

    for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        const keys = label.autokeys.split(',');
        for (let j = 0; j < keys.length; j++) {
            const autokey = keys[j];
            if (details.includes(autokey)) {
                return { status: 200, result: label };
            }
        }
    }
    return { status: 409, result: { message: 'No label matched the details.' } };
}

module.exports.getLabelByDetails = getLabelByDetails;