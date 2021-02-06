const baseService = require("../base-service");

const table_name = 'discgolfplayerholes';

async function getPlayerHolesForPlayerRound(playerroundid, title='Get player holes for disc golf round') {

    const playerHolesResponse = await baseService.getAll(table_name);
    if (playerHolesResponse.status !== 200) { return playerHolesResponse; }
    const playerHoles = playerHolesResponse.result;

    return { status: 200, result: playerHoles.filter(h => h.playerroundid === playerroundid) };
}

module.exports.getPlayerHolesForPlayerRound = getPlayerHolesForPlayerRound;