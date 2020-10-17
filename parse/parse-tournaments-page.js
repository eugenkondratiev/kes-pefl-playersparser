// const { getHtml, getParameter, getRoundName, tCodes, getZ, getGameObj, getTvObj, getSearchParameter } = require('../utils/getters');
// const { pefl } = require('./selectors');


// const getFFs = require('../scrap-html/scrap-tournaments');
const getCupsRefs = require('../scrap-html/scrap-tournaments-refs');
const getCzRef = require('../scrap-html/scrap-cz-ref')

const { getHtml } = require('../utils/getters');
const { pefl, bodySelecor, tSelector, tournamentsPageRef } = require('./selectors')

module.exports = (_nightmare) => {
    return new Promise((res, rej) => {
        console.log("=================================================");
        console.log(" !!!!! start parse tournaments");

        _nightmare
            .goto(tournamentsPageRef)
            // .goto(quaterUrl)
            .wait(tSelector)
            // .wait(mainFrame)
            .evaluate(getHtml, bodySelecor)
            // .end()
            .then(htmlCode => {
                console.log("then->  !!!!! start getCupsRefs");
                const ffList = getCupsRefs(htmlCode)
                const refToCurrentSeason = getCzRef(htmlCode)
                //  console.table(oneRoundGames );
                // console.table( getRoundList(response));
                // nightmare.end();
                res({ ffList: ffList, refToCurrentSeason: pefl + refToCurrentSeason });
                // console.log( getPlayers(response));
            })
            .catch(err => {
                console.log(" parse tornament error - ", err);
                rej(err)
            })
    })
}
