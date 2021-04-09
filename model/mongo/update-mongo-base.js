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


function updateAllplayers(_collection, newPlayersBase) {

    return new Promise(async (yep, nope) => {
        try {
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
    console.log(" main mongoDB  - ", players.length);
    const mongoClient = await require('./db-mongo')();
    const collection = mongoClient._db.collection(COLLECTION);
    await collection.deleteMany({});
    console.log("DELETE players DONE");

    try {
        const playersBaseStatistic = await updateAllplayers(collection, players);
        // console.log("Update players DONE  ", playersBaseStatistic);

        const host = await getHost(mongoClient._db);
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
    } catch (err) {
        console.log("mongodb  updateAllplayers errror", err)
    } finally {
    }
}

module.exports = main