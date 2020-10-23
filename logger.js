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

   const message = "\r\n- " + dt.toLocaleString() + "-" + data;
    fs.appendFile(logFile, message, (err) => {
        if (err) console.log(err.message);
    });

 }