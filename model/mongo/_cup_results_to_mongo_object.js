const fs = require('fs');

async function formMongoCupRecord(results) {
    const id = results.id;
    const [type, tournament, season] = results.id.split('_');
    const roundsArray = Object.entries(results.rounds);

    function checkIfItsTwoGamesCup(results) {
        if (results.pl) return false;
        const firstRound = roundsArray[0][0];
        const firstGame = results.games[0];
        const testOpposites = [firstGame.opposites[0].j, firstGame.opposites[1].j]
        return results.games.some(g => (g.opposites[0].j === testOpposites[1] && g.opposites[1].j === testOpposites[0]))
    }
    const doc = { t: tournament, season, type, _id: results.id, name: results.name, completedRound: 0 }
     doc.completedRound = 0;
    doc.twoGamesCup = checkIfItsTwoGamesCup(results);
    if (results.groups && results.groups.data) {
        doc.groups = results.groups.data.map(gr => {
            return {
                _id: `${doc.type}g_${gr.j}_${doc.season}`,
                name: gr.name.replace(`${doc.name}. `, "")
            }
        })
    }

    doc.rounds = (doc.twoGamesCup
        ? roundsArray.filter((round, i, _arr) => {
             return !(!(i % 2) && _arr[i + 1] && round[1].name === _arr[i + 1][1].name);
        })
        : roundsArray)
        .map(round => {
            const _roundId = round[0];
            const _games = results.games
                .filter(g => g.roundID == _roundId)
                .map(g => {
                    if (g.games == "") return {}
                    const _team1 = g.opposites[0];
                    const _oneGame = !doc.twoGamesCup || round[1].name == "Финал" && !g.secondGameObj;
                    const gameRecord = {
                        team1: _team1,
                        team2: g.opposites[1],
                        lastGame: {
                            _score: _oneGame ? g.games : g.games[0],
                            report: _oneGame ? g.firstGameObj : g.secondGameObj,
                            tv: g.tvObj,
                        }
                    }
                    if (!_oneGame) {
                        gameRecord.firstGame = {
                            _score: g.games[1],
                            report: g.firstGameObj,
                            tv: results.games.find(g => g.roundID == _roundId - 1 && _team1.j == g.opposites[1].j).tvObj
                        }
                    }

                    return gameRecord
                })
            return { _id: `${doc.season}_${_roundId}_${round[1].ff}`, roundID: _roundId, name: round[1].name, games: _games }
        });
    results.groups ? doc.pl = results.pl : undefined
    // console.log("  ### checkIfItsTwoGamesCup  - ", doc.twoGamesCup);
    const jsonFileName = `data/mongo/_${doc._id}-${doc.name}.json`
    fs.writeFile(jsonFileName, JSON.stringify(doc, null, " "), "utf8", err => { err ? console.error : undefined })
    return doc
}

module.exports = formMongoCupRecord;