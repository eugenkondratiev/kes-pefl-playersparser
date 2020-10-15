// const { getHtml, getParameter, getRoundName, tCodes, getZ, getGameObj, getTvObj, getSearchParameter } = require('../utils/getters');
const { getHtml } = require('../utils/getters');


// const getFFs = require('../scrap-html/scrap-tournaments');
const getCupsRefs = require('../scrap-html/scrap-tournaments-refs');

const { bodySelecor, tSelector, tournamentsPageRef } = require('./selectors')

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
                //  console.table(oneRoundGames );
                // console.table( getRoundList(response));
                // nightmare.end();
                res(ffList);
                // console.log( getPlayers(response));
            })
            .catch(err => {
                console.log(" parse tornament error - ", err);
                rej(err)
            })
    })
}
