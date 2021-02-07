const baseService = require("../base-service");
const playerRoundService = require("./player-round-service");
const playerHolesService = require("./player-holes-service");
const holeService = require("./hole-service");

const table_name = 'discgolfrounds';

async function getFilledOutRound(roundid, title='Get filled out disc golf round') {

    const roundResponse = await baseService.getOne(table_name, roundid);
    if (roundResponse.status !== 200) { return roundResponse; }
    const round = roundResponse.result;

    const courseResponse = await baseService.getOne('discgolfcourses', round.courseid);
    if (courseResponse.status !== 200) { return courseResponse; }
    const course = courseResponse.result;

    const playerRoundsResponse = await playerRoundService.getPlayerRoundsForRound(roundid);
    if (playerRoundsResponse.status !== 200) { return playerRoundsResponse; }
    const playerRounds = playerRoundsResponse.result;

    const playersResponse = await baseService.getAll('discgolfplayers');
    if (playersResponse.status !== 200) { return playersResponse; }
    const players = playersResponse.result;

    let playerInfo = [];
    for (let i = 0; i < playerRounds.length; i++) {
        const playerRound = playerRounds[i];
        const playerHolesResponse = await playerHolesService.getPlayerHolesForPlayerRound(playerRound.id);
        let playerHoles = playerHolesResponse.result;
        if (playerHolesResponse.status !== 200) { playerHoles = []; }

        playerInfo.push({
            id: playerRound.playerid,
            name: players.find(p => p.id === playerRound.playerid).name,
            playerRound: playerRound,
            playerHoles: playerHoles
        });
    }

    const filledOutDiscGolfRound = {
        id: roundid,
        date: round.date,
        courseid: round.courseid,
        course: course,
        playerInfo: playerInfo,
        holes: holes
    };
    return { status: 200, result: filledOutDiscGolfRound };
}

async function createFilledOutRound(body, title='Create filled out disc golf round') {

    const courseid = body.courseid;
    const playerids = body.playerids;

    const roundResponse = await baseService.create(table_name, { courseid: courseid });
    if (roundResponse.status !== 200) { return roundResponse; }
    const round = roundResponse.result;

    const courseResponse = await baseService.getOne('discgolfcourses', courseid);
    if (courseResponse.status !== 200) { return courseResponse; }
    const course = courseResponse.result;

    const playersResponse = await baseService.getAll('discgolfplayers');
    if (playersResponse.status !== 200) { return playersResponse; }
    const players = playersResponse.result.filter(p => playerids.includes(p.id));

    const holesResponse = await holeService.getHolesForCourse(courseid);
    if (holesResponse.status !== 200) { return holesResponse; }
    const holes = holesResponse.result;

    const playerInfo = [];
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const playerRoundCreateData = { playerid: player.id, roundid: round.id };

        const playerRoundsResponse = await baseService.create('discgolfplayerrounds', playerRoundCreateData);
        if (playerRoundsResponse.status !== 200) { return playerRoundsResponse; }
        const playerRound = playerRoundsResponse.result;
        
        const playerHoles = [];
        for (let h = 0; h < holes.length; h++) {
            const hole = holes[h];
            const playerHoleResponse = await baseService.create('discgolfplayerholes', {
                playerroundid: playerRound.id, holeid: hole.id
            });
            if (playerHoleResponse.status !== 200) { return playerHoleResponse; }
            playerHoles.push(playerHoleResponse.result);
        }

        playerInfo.push({
            id: player.id,
            name: player.name,
            playerRound: playerRound,
            playerHoles: playerHoles
        });
    }

    const filledOutDiscGolfRound = {
        id: round.id,
        date: round.date,
        courseid: round.courseid,
        course: course,
        playerInfo: playerInfo,
        holes: holes
    };
    return { status: 200, result: filledOutDiscGolfRound };
}

module.exports.getFilledOutRound = getFilledOutRound;
module.exports.createFilledOutRound = createFilledOutRound;