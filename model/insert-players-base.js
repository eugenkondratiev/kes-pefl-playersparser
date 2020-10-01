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
          console.log("playersArr[5]  ", playersArr[5])
          const playersToBd = playersArr.map((el, i) => {
            const player = el;
            player.forEach((col, i, arr) => arr[i] = col.replace(/\,/, ''));
            player[1] = player[0] === '' ? player[1] : player[0] + ' ' + player[1];
            if (player[7] == '') player[7] = '-1';
            // if (player[7] == '-1') console.log(i, player);
            player.shift();
            // if ( i>11882 & i<11885 || i>8609 & i<8612) console.log(i,player[1], player);
            return player
          });
          console.log("playersToBd - ", playersToBd.length);
          const playersFF = playersToBd.filter((element, index) => {
            return true;
            // return index !== 8611 & index !== 11884 & index < 20000
            // return element[2]==ff 
            // if (element[2]==93 & element[5] == 1) console.log(element);
            // if (element[6]==teamId & element[5] > 0) console.log(element);
          });
          console.log("playersFF -", playersFF.length);
          console.log(" #### playersFF[5] -", playersFF[5]);
  
          const playersToMongo = playersFF.map((row, i) => {
            const mongoRow = [...row];
            mongoRow.unshift(i);
            return mongoRow
          });
          console.log(" #### playersToMongo [5]", playersToMongo[5]);
          try {
            const mongoUpdateResult = require('./update-mongo-base')(playersToMongo);
  
          } catch (error) {
            console.log("  mongoUpdateResult ERROR  - ", error)
          }
          // const logRecord = new Date() +  playersFF.length + "players \n";
          // require('fs').appendFile("actionlog.txt", logRecord , err=>{if (err) console.error(err)});
          return dbQuery(insertUpdatePlayersSql, playersFF);
        })
        .then(result => {
          // dbPool.end();
  
  
          const rows = result.rows.affectedRows ? result.rows.affectedRows : 0;
          console.log("__dbQuery result", rows, result);
          resolve(rows);
        })
        .catch(error => {
          // dbPool.end();
          reject(error);
        })
    })
  }