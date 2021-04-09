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
            .wait(1111)
            .wait(tSelector)
            .evaluate(getHtml, bodySelecor)
            .then(htmlCode => {
                const ffList = getCupsRefs(htmlCode)
                const refToCurrentSeason = getCzRef(htmlCode)
                res({ ffList: ffList, refToCurrentSeason: pefl + refToCurrentSeason });
            })
            .catch(err => {
                console.log(" parse tornament error - ", err);
                rej(err)
            })
    })
}
