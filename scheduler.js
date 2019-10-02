
  const schedule = require('node-schedule');
  const getPlayers = require('./model/get-players-base');
   
  // const ruleEveryID = {hour: 11, minute: 16, second: 0, dayOfWeek: [2, 4, 6]};
  const ruleEveryID = {hour: [3, 12] , minute: 14, second: 20, dayOfWeek: [2, 4, 6]};
   const ruleEveryID2 = {hour: 14, minute: [55, 58], second: 14, dayOfWeek: [2, 4, 6]};
  // const ruleEveryID3 = {hour: 1, minute: 30, second: 14, dayOfWeek: [2, 4, 6]};
  // const testruleEveryID = {hour: 11, minute: 50, second: 14, dayOfWeek: [1,  3]};
  // const rule2 = new schedule.RecurrenceRule();

  module.exports = function() {
    const schGetPlayers = schedule.scheduleJob(ruleEveryID, function(){
      console.log(new Date(), 'Get players started');
      getPlayers();
      const logRecord = new Date() +  'Get players done';
      require('fs').writeFile("actionlog.txt", logRecord, err=>{if (err) console.error(err)});
      // j.cancel();
    });
  }