const getSeason = require('../scrap-html/scrap-season-from-ff-roster');
const { getHtml } = require('../utils/getters');
const { bodySelecor } = require('./selectors');

module.exports = async (_nightmare, _ref) => {
    console.log("  _ref  - ", _ref);
    return _nightmare
        .goto(_ref)
        .wait(2000)
        .evaluate(getHtml, bodySelecor)
        .then(htmlCode => {
            const curentSeason = getSeason(htmlCode);
            console.log(" #####  curentSeason from SuperCupRef  - ", curentSeason);
            return curentSeason
        })
        .catch(err => {
            console.log("####  getChamp err ", err);
        })
}