const ParseCup = require('../parse/parse-cup')
const { pefl } = require('../parse/selectors')
const fs = require('fs');
module.exports =    (_nightmare, cupsList, _season) => {
    return new Promise((res, rej) => {
        let groupsList = [];

        cupsList.reduce(function (acc, cupRecord, index, err) {
            return acc.then(function (promResult) {
                const cupRef = pefl + (cupRecord.href ? cupRecord.href : cupRecord[1]);
                const curCupName = cupRecord.href ? cupRecord.name.trim() : cupRecord[0].trim();

                return ParseCup(_nightmare, cupRef, curCupName, _season)
                    .then(results => {

                        fs.writeFile(`data/_${cupRecord[0] ? "euro" : ""}cups/_${curCupName}-${results.season}.json`, JSON.stringify(results, null, " "), async err => {
                            if (err) { console.log(err); }
                            else {
                                if (results.groups && results.groups.data.length > 0) {
                                    groupsList = groupsList.concat(results.groups.data);
                                }
                                await require('./update-databases')(results)
                            }
                        });
                        return promResult.concat([]);
                    })
                    .catch(err => { if (err) console.log(" ParseCup error ", err) })
            });
        }
            , Promise.resolve([]))
            .then(() => {
                res(groupsList)
            })
            .catch((err) => {
                console.log("update national cups error ", err);
                rej("FAIL " + err.message)
            })
    })
}