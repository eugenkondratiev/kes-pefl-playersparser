module.exports = function() {
    console.log("lets get players base");
    return new Promise((res, rej) => {
      const zip = new require('adm-zip')('desmond_jim.zip');
      zip.extractAllTo( /*target path*/ "data/", /*overwrite*/ true);
      const dataarr = [];
      const iconv = require("iconv-lite");
      const fs1 = require('fs');
      fs1.createReadStream('data/desmond_jim.txt')
        .pipe(iconv.decodeStream('win1251'))
        .pipe(iconv.encodeStream('utf8'))
        .on('start', function () {
          console.log('read desmond_jim.txt stream started');
        })
        .on('data', function (data) {
          dataarr.push(data);
        })
        .on('end', function (data) {
          console.log("desmond_jim.txt reading done");
  
          const playerRecords = dataarr.toString('utf8').slice(1).split('|');
          const players = [];
          let rec = [];
          let r = 0;
          playerRecords.forEach(el => {
            rec.push(el);
            if (++r === 9) {
              players.push(rec);
              r = 0;
              rec = [];
            };
  
          });
  
          res(players);
  
  
        })
        .on('error', function (err) {
          console.log("stream error - ", err);
          rej(err);
  
        });
    })
  }