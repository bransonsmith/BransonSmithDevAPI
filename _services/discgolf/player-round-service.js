const baseService = require("../base-service");

const table_name = 'discgolfplayerrounds';

async function getPlayerRoundsForRound(roundid, title='Get player rounds for disc golf round') {

    const playerRoundsResponse = await baseService.getAll(table_name);
    if (playerRoundsResponse.status !== 200) { return playerRoundsResponse; }
    const playerRounds = playerRoundsResponse.result;

    return { status: 200, result: playerRounds.filter(r => r.roundid === roundid) };
}

module.exports.getPlayerRoundsForRound = getPlayerRoundsForRound;