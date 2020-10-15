const pefl = 'http://pefl.ru/';
const fs = require('fs');
const cheerio = require('cheerio');
let nightmare = require('../utils/pefl-auth')();

// const COLLECTION = 'clubs';
const { getHtml, getParameter, getRoundName, tCodes, getZ, getGameObj, getTvObj, getSearchParameter } = require('../utils/getters');

// async function getHost(_db) {
//     const record = await _db.collection("info").find({ host: { $exists: true } }).toArray();
//     return record[0].host;
// }
const tournamentsPageRef = 'http://pefl.ru/plug.php?p=refl&z=48c617d600c4110a664d80c8d852d463';
const tSelector = 'td.back4 > table > tbody > tr:nth-child(2) > td > p:nth-child(2) > table';
// const tSelector = 'body > table > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr > td.back4 > table > tbody > tr:nth-child(2) > td > p:nth-child(2) > table';
const bodySelecor = 'body';
const mainFrame = 'body > table > tbody > tr > td:nth-child(2) > table:nth-child(5)';
const engFFselector = 'body > table > tbody > tr > td:nth-child(2) > table:nth-child(3) > tbody > tr > td.back4 > table > tbody > tr:nth-child(2) > td > p:nth-child(2) > table > tbody > tr:nth-child(3) > td:nth-child(1) > a'

const getCzRef = html => {
    console.log('=======================================================');
    let data = [];
    const $ = cheerio.load(html);
    const cupA = $('a:contains("Чехия")');
    // console.log('Tcups object - ', cupA);
    console.log('Found  - ', cupA.length, ' results');
    if (cupA[1]) {
        $(cupA).each((i, cup) => {
            data.push({ name: $(cup).text(), href: $(cup).attr("href") })
        });
        return data;
    } else {
        return cupA.attr('href');
    }
}

const getSeason = html => {
    console.log('=======================================================');
    // let data = [];
    const $ = cheerio.load(html);
    const cupA = $('a:contains("Суперкубок")');
    // console.log('Tcups object - ', cupA);

    return getParameter(cupA.attr('href'), "f");

}


function parseCz(_nightmare, _ref) {
    console.log("####  we are hear   getChamp",);
    return _nightmare
        .goto(_ref)
        // .wait(tSelector)
        .wait(2000)
        // .wait(mainFrame)
        .evaluate(getHtml, bodySelecor)
        .then(htmlCode => {
            // const ffList = getFFs(htmlCode)
            // console.log("####  we are hear   getTournaments  htmlCode ", htmlCode);
            const curentSeason = getSeason(htmlCode);
            console.log(" #####  curentSeason from SuperCupRef  - ", curentSeason);
            return curentSeason
            // return ffList;
        })
        .catch(err => {
            console.log("####  getChamp err ", err);
            // rej(err)
            // })
        })
}
function getTournaments(_nightmare) {
    console.log("####  we are hear   getTournaments",);

    return _nightmare
        .goto(tournamentsPageRef)
        .wait(tSelector)
        .wait(300)
        // .wait(mainFrame)
        .evaluate(getHtml, bodySelecor)
        .then(htmlCode => {
            const czRef = getCzRef(htmlCode);
            console.log(" #####  iraRef   - ", czRef);
            return czRef
            // return ffList;
        })
        .catch(err => {
            console.log("####  we are hear   getTournaments err ", err);
        })

}
async function getSeasonFromDb(_collection) {
    // const mongoClient = await require('../db-mongo')();
    // const collection = mongoClient._db.collection(COLLECTION);
    try {
        const record = await _collection.find({ season: { $exists: true } }).toArray();
        return record[0].season;

    } catch (err) {
        console.log("getSeasonFromDb errror", err)
    }
    finally {
        ;
        // setTimeout(() => {
        //     mongoClient.client.close();
        // }, 3000);
    }
}


async function checkSeason() {
    let mongoClient;
    // const collection = mongoClient._db.collection(COLLECTION);
    try {
        mongoClient = await require('../db-mongo')();

        const dbSeason = await getSeasonFromDb(mongoClient._db.collection("info"));
        console.log('##### HOST ####', dbSeason);
        // nightmare = await require('../utils/pefl-auth-async')();
        // nightmare  = await nightmare.wait(2000);
        // console.log('##### nightmare ####  !!!');
        const _nnnmr = nightmare;
        // const _nm = getTournaments(nightmare);
        const _czRef = pefl + (await getTournaments(nightmare));
        console.log(" _czRef", _czRef);
        const _season = await parseCz(nightmare, _czRef);
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

nightmare.then(() => {
    checkSeason()
        .then(() => { console.log("#### main END - "); })
        // .then(() => {console.log("#### main END - "); nightmare.end(); })
        .catch((error) => {
            console.log("#### main error  - ", error);
            nightmare.end();
        })
})

