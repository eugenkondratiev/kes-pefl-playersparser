const dbPool = require('./connection-pool');
const dbQuery = require('./db').dbQuery;
const ID = 0;

module.exports = function() {
  return new Promise((res,rej) => {
    dbQuery('SELECT * FROM pefl.players;')
    .then(result => {
      console.log("result.rows  - ", result.rows.filter((pl,i)=>(i<11)));

        global.playersBase = []; 
        try {
            result.rows.forEach(function(row, i, arr) {
                const playerRecord = [].concat(row);
                playerRecord.shift();
                global.playersBase.push(playerRecord);
                res(playersBase)
        }); 
        } catch (error) {
            console.log("SELECT * FROM pefl.players error - ", error);
            rej(error);
        }

    })

    .catch(err => {
        console.log("get players error - ", err); 
        // dbPool.end()
        rej(err);
    })
  })  




}
    