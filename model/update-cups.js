const ParseCup = require('../parse/parse-cup')
const { pefl } = require('../parse/selectors')
const fs = require('fs');
module.exports = (_nightmare, cupsList, _season) => {
    return new Promise((res, rej) => {
        let groupsList = [];

        cupsList.reduce(function (acc, cupRecord, index, err) {
            // subList.reduce(function(acc, cupRecord, index, err) {
            return acc.then(function (promResult) {
                const cupRef = pefl + (cupRecord[0] ? cupRecord[1] : cupRecord.href);
                const curCupName = cupRecord[0] ? cupRecord[0].trim() : cupRecord.name.trim();

                // const curCupName = cupRecord.name.trim();
                // console.log(' update-national-cups cupRecord :>> ', cupRecord);
                return ParseCup(_nightmare, cupRef, curCupName, _season)
                    .then(results => {

                        fs.writeFile(`data/_${cupRecord[0] ? "euro" : ""}cups/_${curCupName}-${results.season}.json`, JSON.stringify(results, null, " "), async err => {
                            if (err) { console.log(err); }
                            //  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                            else {
                                if (results.groups && results.groups.data.length > 0) {
                                    // console.log("results.groups.data- ", results.groups.data);
                                    groupsList = groupsList.concat(results.groups.data);
                                    // console.log("---------------------------groupsList- ", groupsList);
                                }

                                await require('./update-databases')(results)
                            }
                            //  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        });
                        return promResult.concat([]);
                    })
                    .catch(err => { if (err) console.log(" ParseCup error ", err) })
            });
        }
            , Promise.resolve([]))
            .then(() => {
                res("OK")
            })
            .catch((err) => {
                console.log("update national cups error ", err);
                rej("FAIL " + err.message)
            })
    })
}