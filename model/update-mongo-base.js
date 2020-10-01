const pefl = 'http://pefl.ru/';
const COLLECTION = 'allbase';

// const dbQuery = require('../../model/db').dbQuery;
// const dbPool = require('../../model/connection-pool-eco')();
// const sqlplayers = " select * from `pefl`.`players`";

async function getHost(_db) {
    const record = await _db.collection("info").find({
        host: {
            $exists: true
        }
    }).toArray();
    return record[0].host;
}


function updateAllplayers(_collection, _players) {


    const lastplayer = _players.length - 1;
    console.log("lastplayer   ", lastplayer);
    return new Promise(async (yep, nope) => {

        try {
            const newPlayersBase = _players.map((n, i) => {
                const [_id, name, nation, age, position, type, team, ff, href] = n;
                const playerRecord = {
                    _id,
                    name,
                    nation,
                    age,
                    position,
                    team,
                    ff
                };
                if (type === '1') playerRecord.pens = true;
                if (type === '2') playerRecord.school = true;
                if (href && href != -1) playerRecord.freeRef = href;
                if (i === lastplayer) {
                    console.log(i, "i === lastplayer", playerRecord)

                    // yep(null);
                }

                return playerRecord
            });
            console.log("newPlayersBase[5] - ", newPlayersBase[5])
            const result = await _collection.insertMany(
                newPlayersBase, {}
            );

            yep({
                all: newPlayersBase.length,
                school: newPlayersBase.filter(pl => pl.school).length,
                pens: newPlayersBase.filter(pl => pl.pens).length,
            });

        } catch (error) {
            console.log("save errror", error);
            nope(error);
        }
    })

}

async function main(players) {
    // const request = await dbQuery(sqlplayers);
    // const players = request.rows
    console.log(" main mongoDB  - ", players.length);

    console.log(" main mongoDB  - ", players[5]);

    const mongoClient = await require('./db-mongo')();
    const collection = mongoClient._db.collection(COLLECTION);

    await collection.remove({});
    console.log("DELETE players DONE");

    try {
        const playersBaseStatistic = await updateAllplayers(collection, players);
        console.log("Update players DONE  ", playersBaseStatistic);
        // console.log("Update players DONE");

        const host = await getHost(mongoClient._db);
        console.log('##### HOST ####', host)
        const updateResult = await mongoClient._db.collection("info").updateOne({
            players: {
                $exists: true
            }
        }, {
            $set: {
                players: playersBaseStatistic
            },
            $currentDate: {
                lastModifiedPlayers: true
            }
        })
        console.log("mongodb info updated ", updateResult.result);
    } catch (err) {
        console.log("mongodb  updateAllplayers errror", err)
    } finally {
        // setTimeout(() => {
        //     mongoClient.client.close();
        //     dbPool.end();
        // }, 1000);
    }

}


module.exports = main