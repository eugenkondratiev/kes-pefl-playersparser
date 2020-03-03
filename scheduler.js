const schedule = require('node-schedule');
const getPlayers = require('./model/get-players-base');
const dbQuery = require('./model/db').dbQuery; 

const ruleEveryID = {
  hour: 3,
//hour: [3, 10],
  minute: 14,
  second: 20,
  dayOfWeek: [0, 2, 4, 6]
};
// const ruleEveryID = {hour: 11, minute: [36  , 38], second: 14, dayOfWeek: [1, 2, 4, 6]};
const ruleEveryHour = {minute: 1, second: 4};

module.exports = function () {
  async function playerBaseUpdateAction() {
    console.log(new Date(), 'Get players started');
    try {
      const pl = await getPlayers();
      const logRecord = new Date() + 'Get players done\n';
      require('fs').appendFile("actionlog.txt", logRecord, err => {
        if (err) console.error(err)
      });
    } catch (error) {
      const logRecord = new Date() + error.message + '  \n';
      require('fs').appendFile("actionlog.txt", logRecord, err => {
        if (err) console.error(err)
      });
    };
  }

  playerBaseUpdateAction().then(() => true, (err) => console.log(err));
  const schDbPing = schedule.scheduleJob(ruleEveryHour, async function(){
     try {
      await dbQuery("SELECT 1");

     } catch (error) {
       console.log(error);
       const logRecord = new Date() + "  DbPing - error " + error.message + "\n";
            require('fs').appendFile("./data/actionlog.txt", logRecord, err=>{if (err) console.error(err)});
     } 

    });
  const schGetPlayers = schedule.scheduleJob(ruleEveryID, function () {
    playerBaseUpdateAction().then(() => true, (err) => console.log(err));

    // j.cancel();
  });
}