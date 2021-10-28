const fs = require('fs');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);

module.exports = async results => {
    try {
        await require('./update-cup-bd')(results);
    } catch (error) {
        console.log("/update-cup-bd error - ", error);
        fs.writeFile("update-cup-bd error.log", (new Date().toLocaleString()) + "\n" + JSON.stringify(error, null, " ") + "\n\n\n", err => {
            if (err) console.log(err);
        })
    }
    try {
        const mongoRecord = await require('./mongo/_cup_results_to_mongo_object')(results);
        await require('./mongo/insert-cup-to-mongo')(mongoRecord);
    } catch (error) {
        console.log("model/insert-cup-to-mongo error  - ", error);
        // await writeFile(`data/cupsRefs-${startTime.toLocaleDateString()}.json`, JSON.stringify(cupsRefs, null, " "));
        try {
            await writeFile("model/insert-cup-to-mongo error.log", (new Date().toLocaleString()) + "\n" + JSON.stringify(error, null, " ") + "\n\n\n");

        } catch (err) {
            if (err) console.log(err)
        }

    }

}