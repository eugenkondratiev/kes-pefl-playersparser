const schedule = require('node-schedule');
const getPlayers = require('./model/get-players-base');
const updateCups = require('./model/update-cups-base');
const dbQuery = require('./model/db').dbQuery;
const fs = require('fs');
const logIt = require('./logger');

const ruleEveryID = {
  hour: 4,
  minute: 14,
  second: 20,
  dayOfWeek: [2, 4, 6]
};
const ruleEveryWeek = {
  hour: 13,
  minute: 6,
  second: 7,
  dayOfWeek: 0
};

const ruleEveryHour = { minute: 1, second: 4 };
// const ruleEveryHour2 = { minute: 58, second: 8 };

module.exports = function () {

  async function updateAction(logFile, msg, cb) {
    console.log(`${(new Date()).toLocaleString()} ${msg} started`);
    try {
      await cb();
      logIt(msg, logFile)
    } catch (error) {
      logIt(error.message, logFile)
    };
  }


  updateAction("", "Get players", getPlayers).then(() => true, (err) => console.log("###### - playerBaseUpdateAction", err));
 // setTimeout(() => {
 //   updateAction("cups", "Update cups", updateCups).then(() => true, err => console.log("###### - cupsUpdateAction", err));

 // }, 120000)

  const schDbPing = schedule.scheduleJob(ruleEveryHour, async function () {
    try {
      await dbQuery("SELECT 1");
    } catch (error) {
      console.log(error);
      logIt("  DbPing - error " + error.message + "\n")
    }

  });
  // const schGetPlayers = schedule.scheduleJob(ruleEveryHour, function () {
  const schGetPlayers = schedule.scheduleJob(ruleEveryID, function () {
    updateAction("", "Get players", getPlayers).then(() => true, (err) => console.log(err));

  });
  // const schParseCups = schedule.scheduleJob(ruleEveryHour2, function () {
  const schParseCups = schedule.scheduleJob(ruleEveryWeek, async function () {
    updateAction("cups-", "Update cups", updateCups).then(() => true, (err) => console.log(err));
    ;
  });

}
