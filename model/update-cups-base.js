const parseTournaments = require('../parse/parse-tournaments-page')
const parseLocalCups = require('../parse/parse-local-cups');
const util = require('util');
const fs = require('fs')
const writeFile = util.promisify(fs.writeFile);

module.exports = async () => {
    const nightmare = require('../parse/pefl-auth')();
    console.log(" Start update cups base");
    console.log("=================================================");
    let startTime = new Date();
    let cupsList;
    let oldMongoBase;
    let allCupsRefs;
    try {
        cupsList = await parseTournaments(nightmare);
        allCupsRefs = await parseLocalCups(cupsList, nightmare);
        await writeFile(`data/international-cups-list-${startTime.toLocaleDateString()}.json`, JSON.stringify(cupsList.ec, null, " "));
        await writeFile(`data/ff-cups-list-${startTime.toLocaleDateString()}.json`, JSON.stringify(allCupsRefs, null, " "));
        console.log("Done. Calculation time", new Date() - startTime, "ms");

    } catch (error) {
        console.log("update cup DB error", error)
        // }

        // try {
        //     oldMongoBase = await getCurrentPlayerMongoBase()
        // } catch (error) {
        //     console.log("upload base from mongodb error")
        // }
        // await parsePlayersBase(jim, nightmare)
        // playersArray = await handlePlayersFile();

        
        // nightmare.end();
    }
    finally {
        // nightmare.end();
    }
}