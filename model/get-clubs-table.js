// const dbPool = require('./connection-pool')();
const dbQuery = require('./db').dbQuery;
const ID = 0;

module.exports = function() {
  return new Promise((res,rej) => {
      console.log('SELECT * FROM pefl.clubs;');
    dbQuery('SELECT * FROM pefl.clubs;')
    .then(result => {
        console.log("pefl.clubs selected")
        global.clubsBase = []; 
        try {
            result.rows.forEach(function(row, i, arr) {
                const clubId = parseInt(row[ID]);
                global.clubsBase[clubId] = row;
        }); ;
        } catch (error) {
            console.log(error);
            rej(error);
        }

    })

    .catch(err => {
        console.log("get Clubs error - ", err); 
        rej(err);
    })
    .then( ()=> {
        global.nationBase = [];
        return dbQuery('SELECT * FROM pefl.nations_short;');
    })
    .then((nations) => {
        nations.rows.forEach(nation => {
            nationBase[nation[ID]] = nation;
        })
        res(nationBase)
    })
    .catch(err => {
        console.log("get Nations error - ", err);
        rej(err);
    });
  })  


}
    