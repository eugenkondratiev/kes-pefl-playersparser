const fs = require('fs');


// const testCupFile = './data/_Ирландия.Кубок_17.json';
// const testCupFile2 = './data/_Англия.Кубок.json';
// const testEurocup = './data/_ec-Лига Европы-ec_233_17.json';


async function formMongoCupRecord(results) {
    const id = results.id;
    // console.log("CUP ID - ", id, "data.id  -", results.id);
    // console.log("data  -", results);
    const [type, tournament, season] = results.id.split('_');
    // console.log("parameters  - ", type, tournament, season);

    // console.log(results.rounds, typeof results.rounds);

    // const roundsArray = [...results.rounds];
    // const roundsArray = Array.from(results.rounds);

    const roundsArray = Object.entries(results.rounds);

    function checkIfItsTwoGamesCup(results) {
        // console.log(" results.groups  ", results.groups);
        if (results.pl) return false;
        const firstRound = roundsArray[0][0];

        // console.log("first round - ", firstRound);
        const firstGame = results.games[0];
        const testOpposites = [firstGame.opposites[0].j, firstGame.opposites[1].j]
        // console.log("Opposites first - ", testOpposites);

        return results.games.some(g => (g.opposites[0].j === testOpposites[1] && g.opposites[1].j === testOpposites[0]))
    }

    // const mongoDoc = formCupDoc({
    //     data: data,
    //     season: parseInt(parameters[2]),
    //     tournament: parseInt(parameters[1]),
    //     type: parameters[0]
    // });
    const doc = { t: tournament, season, type, _id: results.id, name: results.name, completedRound: 0 }
    // doc.t = tournament;
    // doc.name = results.name;
    // doc._id = results.id;
    // doc.type = type;
    doc.completedRound = 0;
    doc.twoGamesCup = checkIfItsTwoGamesCup(results);
    // console.log("### results games- ", results.games, results.games.length);
    if (results.groups && results.groups.data) {
        //its tournament with groups add their _id
        doc.groups = results.groups.data.map(gr => {
            return {
                _id: `${doc.type}g_${gr.j}_${doc.season}`,
                name: gr.name.replace(`${doc.name}. `, "")
            }
        })
    }

    // console.log(doc.twoGamesCup ? "TWO games cup" : " ONE game cup");
    doc.rounds = (doc.twoGamesCup
        ? roundsArray.filter((round, i, _arr) => {
            // const isDouble = (!(i % 2) && _arr[i + 1] && round[1].name === _arr[i + 1][1].name)
            // console.log(i, round,"!(i % 2) -", !(i % 2));
            // console.log(!!_arr[i + 1], round[1].name, !!_arr[i + 1] && _arr[i + 1][1].name, isDouble);
            // return !isDouble
            return !(!(i % 2) && _arr[i + 1] && round[1].name === _arr[i + 1][1].name);
        })
        : roundsArray)
        .map(round => {
            // console.log("Filtered round - ", round);
            const _roundId = round[0];
            const _games = results.games
                .filter(g => g.roundID == _roundId)
                .map(g => {
                    if (g.games == "") return {}
                    const _team1 = g.opposites[0];
                    const _oneGame = !doc.twoGamesCup || round[1].name == "Финал" && !g.secondGameObj;
                    // console.log(_roundId, round[1].name, g.games);
                    // console.log("  .map(g ", doc.twoGamesCup, round[1].name == "Финал", g.secondGameObj);
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
            // console.log("round - ", _roundId, _games);

            return { _id: `${doc.season}_${_roundId}_${round[1].ff}`, roundID: _roundId, name: round[1].name, games: _games }
        });
    results.groups ? doc.pl = results.pl : undefined
    // console.log(" #### roundsArray - ", doc.rounds);

    console.log("  ### checkIfItsTwoGamesCup  - ", doc.twoGamesCup);
    const jsonFileName = `data/mongo/_${doc._id}-${doc.name}.json`
    console.log(jsonFileName);
    fs.writeFile(jsonFileName, JSON.stringify(doc, null, " "), "utf8", err => { err ? console.error : undefined })



    return doc
}

// async function readToutnamentFile(_name) {
//     fs.readFile(_name, async (err, data) => {
//         if (err) {
//             console.log(err);

//             return
//         }
//         const _result = JSON.parse(data);
//         const mongoRecord = await formMongoCupRecord(_result);
//         const jsonFileName = `data/mongo/_${mongoRecord._id}-${mongoRecord.name}.json`
//         console.log(jsonFileName);
//         fs.writeFile(jsonFileName, JSON.stringify(mongoRecord, null, " "), "utf8", err => { err ? console.error : undefined })

//     })
// }
// async function main() {
// await readToutnamentFile(testEurocup);
// await readToutnamentFile(testCupFile);
// await readToutnamentFile(testCupFile2);
// }

// main().catch(()=>true).catch(e=>console.log(e))

module.exports = formMongoCupRecord;