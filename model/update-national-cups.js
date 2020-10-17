const ParseCup = require('../parse/parse-cup')
const { pefl } = require('../parse/selectors')
const fs = require('fs');
module.exports = (_nightmare, cupsList) => {
    return new Promise((res, rej) => {
        cupsList.reduce(function (acc, cupRecord, index, err) {
            // subList.reduce(function(acc, cupRecord, index, err) {
            return acc.then(function (promResult) {
                const curCupName = cupRecord.name.trim();
                // console.log(' update-national-cups cupRecord :>> ', cupRecord);
                return ParseCup(_nightmare, pefl + cupRecord.href, curCupName)
                    .then(results => {

                        fs.writeFile("data/_cups/_" + curCupName + ".json", JSON.stringify(results, null, " "), async err => {
                            if (err) console.log(err);
                            //  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                            //  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                            //  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                            try {
                                require('./update-cup-bd')(results);
                            } catch (error) {
                                console.log("/update-cup-bd error - ", error);
                            }
                            try {
                                const mongoRecord = await require('./mongo/_cup_results_to_mongo_object')(results);
                                // console.log("model/insert-cup-to-mongo  - ", mongoRecord._id, mongoRecord.name);
                                await require('./mongo/insert-cup-to-mongo')(mongoRecord);
                            } catch (error) {
                                console.log("model/insert-cup-to-mongo error  - ", error)
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