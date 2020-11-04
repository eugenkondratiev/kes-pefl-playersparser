/**
 * just for me , I think
 */
const LOG_PATH = "Logs/" ;
const fs = require('fs');

 module.exports = function(data, _prefix ="") {

   const dt = new Date();
    // const logName = dt.toLocaleString().slice(0, -9) + ".log";
    const logName = "actionlog.txt";
   const logFile = LOG_PATH + _prefix +  logName; 
  
   console.log(dt.toLocaleString(), " ", data);

   const message = "\r\n- " + dt.toLocaleString("ua-UA",{year:"numeric",month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit", } ) + "-" + data;
    fs.appendFile(logFile, message, (err) => {
        if (err) console.log(err.message);
    });

 }