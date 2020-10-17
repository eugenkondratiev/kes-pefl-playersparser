const getSeason = require('../scrap-html/scrap-season-from-ff-roster');
const { getHtml } = require('../utils/getters');
const { bodySelecor } = require('./selectors');

module.exports = async (_nightmare, _ref) => {
    // console.log("####  we are hear   getChamp",);
    console.log("  _ref  - ", _ref);
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