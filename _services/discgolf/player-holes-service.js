const baseService = require("../base-service");

const table_name = 'discgolfplayerholes';

async function getPlayerHolesForPlayerRound(playerroundid, title='Get player holes for disc golf round') {

    const playerHolesResponse = await baseService.getAll(table_name);
    if (playerHolesResponse.status !== 200) { return playerHolesResponse; }
    const playerHoles = playerHolesResponse.result;
    const filteredHoles = playerHoles.filter(h => h.playerroundid === playerroundid);
    console.log('filteredHoles');
    console.log(filteredHoles);
    const filledOutPlayerHoles = [];
    for (let i = 0; i < filteredHoles.length; i++) {
        const h = filteredHoles[i];
        const holeResponse = await baseService.getOne('discgolfplayerholes', h.holeid);
        if (holeResponse.status !== 200) { return holeResponse; }
        const hole = holeResponse.result;

        filledOutPlayerHoles.push({
            id: h.id,
            playerroundid: playerroundid,
            holeid: hole.id,
            hole: hole,
            score: h.score,
            dots: h.dots,
            shots: h.shots
        });
    }

    return { status: 200, result: filledOutPlayerHoles };
}

module.exports.getPlayerHolesForPlayerRound = getPlayerHolesForPlayerRound;