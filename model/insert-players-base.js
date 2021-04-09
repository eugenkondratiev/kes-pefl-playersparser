module.exports = function() {
    return new Promise((resolve, reject) => {
  
      GetPlayersBase(jim).then(results => {
          console.log("===============================================================================");
          return handlePlayersFile();
        })
        .catch(err => {
          reject("Upload from PEFL problem");
        })
        .then(async playersArr => {
          const ff = 216;
          const playersToBd = playersArr.map((el, i) => {
            const player = el;
            player.forEach((col, i, arr) => arr[i] = col.replace(/\,/, ''));
            player[1] = player[0] === '' ? player[1] : player[0] + ' ' + player[1];
            if (player[7] == '') player[7] = '-1';
            player.shift();
            return player
          });
          console.log("playersToBd - ", playersToBd.length);
          const playersFF = playersToBd.filter((element, index) => {
            return true;
          });
          console.log("playersFF -", playersFF.length);
  
          const playersToMongo = playersFF.map((row, i) => {
            const mongoRow = [...row];
            mongoRow.unshift(i);
            return mongoRow
          });
          try {
            const mongoUpdateResult = require('./mongo/update-mongo-base')(playersToMongo);
  
          } catch (error) {
            console.log("  mongoUpdateResult ERROR  - ", error)
          }
          return dbQuery(insertUpdatePlayersSql, playersFF);
        })
        .then(result => {
          const rows = result.rows.affectedRows ? result.rows.affectedRows : 0;
          resolve(rows);
        })
        .catch(error => {
          reject(error);
        })
    })
  }