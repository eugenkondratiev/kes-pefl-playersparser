// const { pefl } = require('../parse/selectors')
// const dbPool = require('./connection-pool-eco')();
const dbQuery = require('./db').dbQuery;

const sqlUpdateCup = "INSERT INTO `pefl`.`tournaments` (`id`,  `ff`,  `season`, `type`, `name`, `z`) VALUES ? " +
    " ON DUPLICATE KEY UPDATE id = VALUES(id), ff = VALUES(ff), season = VALUES(season), type = VALUES(type), name = VALUES(name), z = VALUES(z)";

const sqlUpdateEuroCup = "INSERT INTO `pefl`.`tournaments` (`id`,  `ff`,  `season`, `type`, `name`, `z`, `pl`) VALUES ? " +
    " ON DUPLICATE KEY UPDATE id = VALUES(id), ff = VALUES(ff), season = VALUES(season), type = VALUES(type), name = VALUES(name), z = VALUES(z), pl = VALUES(pl)";

const sqlUpdateRounds = "INSERT INTO `pefl`.`rounds` (`id`, `tournId`,  `name`, `n`) VALUES ? " +
    " ON DUPLICATE KEY UPDATE id = VALUES(id), tournId = VALUES(tournId), name = VALUES(name), n = VALUES(n)";

const sqlUpdateGames = "INSERT INTO `pefl`.`games` (`id`, `t_id`,  `round`, `opp1`, `opp2`, `tv_z`, `href_z`, `score`, `roundType`) VALUES ? " +
    " ON DUPLICATE KEY UPDATE id = VALUES(id), t_id = VALUES(t_id), round = VALUES(round), opp1 = VALUES(opp1), " +
    "opp2 = VALUES(opp2), tv_z = VALUES(tv_z), href_z = VALUES(href_z), score = VALUES(score), roundType = VALUES(roundType) ";
//=============================================================================
function formGamesList(_games, _id) {
    const list = [];
    _games.forEach(g => {
        try {
            // console.log("g  - ", g);

            const type = (g.games.length == 2) ? "g2" : "g1";
            const id = (type == "g2") ? g.secondGameObj.j : g.firstGameObj.j;
            const round = parseInt(g.roundID);
            const opp1 = parseInt(g.opposites[0].j);
            const opp2 = parseInt(g.opposites[1].j);
            const tv_z = g.tvObj.z;
            const href_z = (type == "g2") ? g.secondGameObj.z : g.firstGameObj.z;
            const score = (type == "g2") ? g.games[0] : g.games;
            const record = [id, _id, round, opp1, opp2, tv_z, href_z, score, type];
            if (record.includes(NaN)) {
                console.log("NaN record - ", g, record)
            };
            // console.log("game record - ", record, _clubs[opp1], _clubs[opp2]);
            if (record[0]) list.push(record);
        } catch (error) {
            console.log("### update-cup-bd", error)
        }

    });
    return list;
}
//=============================================================================
function formRoundsList(_rounds, _id) {
    const list = [];
    for (r in _rounds) {
        const n = parseInt(r);
        list.push([_id + "_" + n, _id, _rounds[r].name, n]);
    }
    console.log("=============================================");
    console.log("##### roundslist - ", list);
    return list;
}
//=============================================================================
// const formCupDoc = reqiure('./utils/form-cup-document.js');

async function updateCup(data) {
    const id = data.id;
    console.log("CUP ID - ", id, "data.id  -", data.id);
    // console.log("data  -", data);
    const parameters = data.id.split('_');
    console.log("parameters  - ", parameters);

    const tRecord = [id, parseInt(parameters[1]), parseInt(parameters[2]), parameters[0], data.name, data.z];
    let sqlCup;
    if (data.pl) {
        tRecord.push(data.pl);
        sqlCup = sqlUpdateEuroCup // for eurocups
    } else {
        sqlCup = sqlUpdateCup
    }

    console.log("tRecord  - ", tRecord);

    try {
        const res1 = await dbQuery(sqlCup, [tRecord]);
        // console.log("res1 - ", res1);
        const roundsList = formRoundsList(data.rounds, id)
        if (roundsList.length) await dbQuery(sqlUpdateRounds, roundsList);
        // console.log("res2 - ", res2);
        const gamesList = formGamesList(data.games, id);

        if (gamesList.length) await dbQuery(sqlUpdateGames, gamesList);
        // console.log("res3 - ", res3);
        // dbPool.end();
    } catch (error) {
        console.log("dbQuery  - ", error);
        // dbPool.end();
    } finally {
        ;
    }
}


module.exports = updateCup;