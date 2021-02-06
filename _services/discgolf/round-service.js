const baseService = require("../base-service");
const playerRoundService = require("./player-round-service");
const playerHolesService = require("./player-holes-service");

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
        if (playerHolesResponse.status !== 200) { console.log(playerHolesResponse); playerHoles = []; }

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
        playerInfo: playerInfo
    };
    return { status: 200, result: filledOutDiscGolfRound };
}

module.exports.getFilledOutRound = getFilledOutRound;