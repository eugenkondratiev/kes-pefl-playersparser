
const getFfCup = require('../scrap-html/scrap-ff-cups');
const { pefl, ffRoster, bodySelecor } = require('./selectors');
const { getHtml } = require('../utils/getters');

module.exports = (cupsList, _nightmare) => {
    return new Promise((res, rej) => {
        
        console.log("cupsList.cups  - " , cupsList.cups.length);
        console.log("=====================================================");
        console.log("================EC======");
        console.log("cupsList.ec  - " , cupsList.ec.length);
        console.log("=====================================================");
        cupsList.cups.reduce(function (acc, url) {
            return acc.then(function (results) {

                return _nightmare.goto(pefl + url[1])
                    .wait(400)
                    .wait(ffRoster)
                    .evaluate(getHtml, bodySelecor)
                    .then((htmlCode) => {
                        return results.concat(getFfCup(htmlCode, url[0]))

                    })
                    .catch(err => { if (err) console.log("inner nightmare error ....  ", err) });
            });
        }, Promise.resolve([]))
            .then(cups => {
                res(cups)
            })
            .catch(err => {
                rej(err)
            })
            ;
    })
}