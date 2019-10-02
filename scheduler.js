
  const schedule = require('node-schedule');
  const getPlayers = require('./model/get-players-base');
   

  const ruleEveryID = {hour: [3, 13] , minute: 14  , second: 20, dayOfWeek: [2, 4, 6]};
  //  const ruleEveryID2 = {hour: 14, minute: [55, 58], second: 14, dayOfWeek: [2, 4, 6]};

  module.exports = function() {
    const schGetPlayers = schedule.scheduleJob(ruleEveryID, function(){
      console.log(new Date(), 'Get players started');
      getPlayers();
      const logRecord = new Date() +  'Get players done\n';
      require('fs').appendFile("actionlog.txt", logRecord, err=>{if (err) console.error(err)});
      // j.cancel();
    });
  }