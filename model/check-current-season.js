async function checkSeason(_nightmare) {
    let mongoClient;
    // const collection = mongoClient._db.collection(COLLECTION);
    try {
        mongoClient = await require('../db-mongo')();

        const dbSeason = await getSeasonFromDb(mongoClient._db.collection("info"));
        console.log('##### HOST ####', dbSeason);
        // nightmare = await require('../utils/pefl-auth-async')();
        // nightmare  = await nightmare.wait(2000);
        // console.log('##### nightmare ####  !!!');
        // const _nnnmr = nightmare;
        // const _nm = getTournaments(nightmare);
        const _czRef = pefl + (await getTournaments(_nightmare));
        console.log(" _czRef", _czRef);
        const _season = await parseCz(_nightmare, _czRef);
        console.log(`SEASON CURRENT ${_season}`);

        //=====TODO : 
        // update mongo info collection
        
    } catch (err) {
        console.log("checkSeason errror", err);
        nightmare.end(() => { console.log(" ERROR nm end"); });
        // mongoClient.client.close();
    }
    finally {
        ;
        setTimeout(() => {
            console.log("Finally done");
            nightmare.end(() => { console.log(" Finally end"); });

            mongoClient.client.close();
        }, 5000);
    }
}

module.exports = checkSeason;