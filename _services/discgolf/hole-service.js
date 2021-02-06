const baseService = require("../base-service");

const table_name = 'discgolfholes';

async function getHolesForCourse(courseId, title='Get holes for disc golf course') {
    
    console.log(`In the service= ${courseId}`);
    const holesResponse = await baseService.getAll(table_name);
    if (holesResponse.status !== 200) { return holesResponse; }
    const holes = holesResponse.result;

    console.log(`holes: `);
    console.log(holes);
    return { status: 200, result: holes.filter(h => h.courseid === courseId) };
}

module.exports.getHolesForCourse = getHolesForCourse;