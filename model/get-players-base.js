const jim = 'http://pefl.ru/desmond_jim.php';
const fs = require('fs')

//INSERT INTO `pefl`.`players` (`id`, `name`, `lastname`, `nation`, `age`, `position`, `type`, `teamId`, `ff`)
// VALUES ('0', 'dfdd', 'rgwrtrw', '93', '15', 'GK', '2', '488', '93');

const insertUpdatePlayersSql = "INSERT INTO pefl.players (`name`, `nation`, `age`, `position`, `type`, `teamId`, `ff`, `href`)" +
  " VALUES ? " +
  " ON DUPLICATE KEY UPDATE name = VALUES(name),  nation = VALUES(nation), age = VALUES(age)" +
  ", position = VALUES(position), type = VALUES(type), teamId = VALUES(teamId), ff = VALUES(ff), href = VALUES(href);";


// const dbPool = require('./connection-pool-eco');
const dbQuery = require('./db2').dbQuery;

// const GetPlayersBase = require('../parse/parse-players-base');
const handlePlayersFile = require('../parse/handle-players-file');
const getCurrentPlayerBase = require('./get-current-players-main-base');
const getCurrentPlayerMongoBase = require('./mongo/get-current-players-mongo-base');
const parsePlayersBase = require('../parse/parse-players-base');
const formMongoPlayerString = require('../view/form-mongo-player-string');

async function insertPlayersBase(playersArr, _oldBase, _oldMongoBase) {
  try {
    const playersToBd = playersArr.map((el, i) => {
      const player = el;
      player.forEach((col, i, arr) => arr[i] = col.replace(/\,/, ''));
      player[1] = player[0] === '' ? player[1] : player[0] + ' ' + player[1];
      if (player[7] == '') player[7] = '-1';
      player.shift();
      return player
    });

    console.log("playersToBd - ", playersToBd.length);

    const playersToMongo = playersToBd.map((row, i) => {
      const mongoRow = [...row];
      mongoRow.unshift(i);
      return mongoRow
    });
    const newMongoPLayers = require('./mongo/players-to-mongo-records')(playersToMongo)
    const _diff = require('./calc-players-diffference')(_oldMongoBase, newMongoPLayers);
    console.log("#####  Different players - ", _diff.changed.length);

    try {

      fs.writeFile(`data/currentDifferentPlayers/_${(new Date()).toLocaleDateString("ru-UA",{year:"numeric",month:"2-digit", day:"2-digit"})}.json`, JSON.stringify(_diff.changed), {
        encoding: "utf8"
      }, err => {
        if (err) console.error
      })

      if (_diff.changed.length < 10000) {
        await require('../services/process-possible-new-doubles')(_diff.changed, newMongoPLayers)
      }
    } catch (error) {
      console.log('create bor error error :>> ', error);
    }


    try {
      const mongoUpdateResult = require('./mongo/update-mongo-base')(newMongoPLayers);

    } catch (error) {
      console.log("  mongoUpdateResult ERROR  - ", error)
    }
    const result = await dbQuery(insertUpdatePlayersSql, playersToBd)
    const rows = result.rows.affectedRows ? result.rows.affectedRows : 0;
    return rows;
  } catch (error) {
    throw Error(error)
  }
}

/**
 * delete FROM pefl.players where id>0;
alter table pefl.players AUTO_INCREMENT = 1;
 */
async function updatePlayersBase() {
  const nightmare = require('../parse/pefl-auth')();

  let startTime = new Date();
  let oldBase;
  let oldMongoBase;
  let playersArray;
  try {
    const answerClubs = await require('../model/get-clubs-table')();

    oldBase = await getCurrentPlayerBase()
  } catch (error) {
    console.log("upload base from DB error")
  }

  try {
    oldMongoBase = await getCurrentPlayerMongoBase()
  } catch (error) {
    console.log("upload base from mongodb error")
  }
  await parsePlayersBase(jim, nightmare)
  playersArray = await handlePlayersFile();

  // nightmare.end();
  await dbQuery("delete FROM pefl.players where id>0; alter table pefl.players AUTO_INCREMENT = 1;")
  try {
    console.log("table cleared");
    const resp = await insertPlayersBase(playersArray, oldBase, oldMongoBase);
    console.log("Done. Calculation time", new Date() - startTime, "ms");
    const logRecord = new Date() + "  - " + resp + ' players \n';
    require('fs').appendFile("actionlog.txt", logRecord, err => {
      if (err) console.error(err)
    });
  } catch (error) {
    console.log("Clear players table err --", error)
  } finally {
    console.log("Calculation time", new Date() - startTime, "ms");
  };
}

module.exports = updatePlayersBase;