const schedule = require('node-schedule');
const getPlayers = require('./model/get-players-base');
const dbQuery = require('./model/db').dbQuery;

const ruleEveryID = {
  hour: 3,
  minute: 14,
  second: 20,
  dayOfWeek: [2, 4, 6]
};
const ruleEveryWeek = {
  hour: 4,
  minute: 5,
  second: 6,
  dayOfWeek: 0
};

// const ruleEveryID = {hour: 11, minute: [36  , 38], second: 14, dayOfWeek: [1, 2, 4, 6]};
const ruleEveryHour = { minute: 1, second: 4 };
const ruleEveryHour2 = { minute: 8, second: 8 };

module.exports = function () {

  async function cupsUpdateAction() {
    console.log(new Date(), 'Update cups started');
    try {

      // const pl = await getPlayers();
      await require('./model/update-cups-base')();
      const logRecord = new Date() + 'Update cups done\n';

      require('fs').appendFile("cups-actionlog.txt", logRecord, err => {
        if (err) console.error(err)
      });
    } catch (error) {
      const logRecord = new Date() + error.message + '  \n';
      require('fs').appendFile("cups-actionlog.txt", logRecord, err => {
        if (err) console.error(err)
      });
    };
  }

  async function playerBaseUpdateAction() {
    console.log(new Date(), 'Get players started');
    try {

      const pl = await getPlayers();
      const logRecord = new Date() + 'Get players done\n';
      // await require('./model/update-cups-base')();

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
  setTimeout(() => {
    cupsUpdateAction().then(() => true, err => console.log(err));

  }, 120000)

  // require('./model/update-cups-base')().then(() => true, (err) => console.log(err));

  const schDbPing = schedule.scheduleJob(ruleEveryHour, async function () {
    try {
      await dbQuery("SELECT 1");
    } catch (error) {
      console.log(error);
      const logRecord = new Date() + "  DbPing - error " + error.message + "\n";
      require('fs').appendFile("./data/actionlog.txt", logRecord, err => { if (err) console.error(err) });
    }

  });
  const schGetPlayers = schedule.scheduleJob(ruleEveryHour, function () {
    // const schGetPlayers = schedule.scheduleJob(ruleEveryID, function () {
    playerBaseUpdateAction().then(() => true, (err) => console.log(err));

    // j.cancel();
  });
  const schParseCups = schedule.scheduleJob(ruleEveryHour2, async function () {
    // const schParseCups = schedule.scheduleJob(ruleEveryWeek, async function () {
    cupsUpdateAction().then(() => true, (err) => console.log(err));
    ;
  });

}
