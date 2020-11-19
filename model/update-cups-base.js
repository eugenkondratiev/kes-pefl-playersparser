const parseTournaments = require('../parse/parse-tournaments-page')
const parseLocalCups = require('../parse/parse-local-cups');
const parseNationalCups = require('./update-cups');
const parseEuroCups = require('./update-cups');//  same for euro. cup part
const parseEuroGroups = require('./update-groups');//  same for euro. cup part

const util = require('util');
const fs = require('fs');
const parseSeason = require('../parse/parse-season');

const writeFile = util.promisify(fs.writeFile);

module.exports = async () => {
    const nightmare = require('../parse/pefl-auth')();
    console.log(" Start update cups base");
    console.log("=================================================");
    let startTime = new Date();
    let cupsRefs, oldMongoBase, allCupsRefs, currentSeason;
    try {
        cupsRefs = await parseTournaments(nightmare);
        currentSeason = await parseSeason(nightmare, cupsRefs.refToCurrentSeason);
        console.log("######  Current season   - ", currentSeason);
        // console.log('###update -cups-base  cupsRefs :>> ', cupsRefs);
        // await writeFile(`data/cupsRefs-${startTime.toLocaleDateString()}.json`, JSON.stringify(cupsRefs, null, " "));

        allCupsRefs = await parseLocalCups(cupsRefs.ffList, nightmare);
        // await writeFile(`data/international-cups-list-${startTime.toLocaleDateString()}.json`, JSON.stringify(cupsRefs.ffList.ec, null, " "));
        // await writeFile(`data/ff-cups-list-${startTime.toLocaleDateString()}.json`, JSON.stringify(allCupsRefs, null, " "));
        console.log("Done. Calculation time", new Date() - startTime, "ms");

        // console.time("Start national cups ");
        // await parseNationalCups(nightmare, allCupsRefs)

        // console.timeEnd("Start national cups ");

        console.time("euro-cups ");
        const groupsList = await parseEuroCups(nightmare, cupsRefs.ffList.ec, currentSeason)
        console.log('groupsList :>> ', groupsList);
        console.timeEnd("euro-cups ");

        console.time("Start eurocups groups");
        await parseEuroGroups(nightmare, groupsList)

        console.timeEnd("Start eurocups groups");

    } catch (error) {
        console.log("update cup DB error", error)
        // nightmare.end();
    }
    finally {
        // nightmare.end();
    }
}