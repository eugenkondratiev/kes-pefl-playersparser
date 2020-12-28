const {
    getParameter,
    getTvObj,
    getGameObj,
    getSearchParameter
} = require('../utils/getters');
const {
    selTv,
    selOpposites,
    selGames,
    roundGames,
} = require('../parse/selectors')


const getMatches = (_roundID, html) => {
    data = [];
    const $ = require('cheerio').load(html);
    const roundID = _roundID;
    const selRoundGames = roundGames + ' > tbody > tr'
    $(selRoundGames).each((i, game) => {

        const gameString = $(game).find(selOpposites).text();
        const reports = $(game).find(selGames);

        let firstGame;
        let firstGameObj;
        let secondGame;
        let secondGameObj;
        let opposites;
        let jOppositeUrl2;
        let jOppositeUrl1;
        let oppositNames;
        const twoGamesRound = reports.text().match(/ \(/);
        let games = (twoGamesRound) ?
            reports.text().replace(/[\(\)]/g, "").split(" ") :
            reports.text();

        if (games !== 'Отчет') {
            oppositNames = gameString.split(" - ").map(nm => nm.trim());
            jOppositeUrl2 = getSearchParameter($(game).find("td:nth-child(1) > a:nth-child(2)").attr("href"), "j") ||
                getSearchParameter($(game).find("td:nth-child(1) > a:nth-child(3)").attr("href"), "j");
            jOppositeUrl1 = getSearchParameter($(game).find("td:nth-child(1) > a:nth-child(1)").attr("href"), "j");

            if (twoGamesRound) {
                firstGame = reports.find("a:nth-child(2)").attr("href");
                firstGameObj = getGameObj(firstGame);
                secondGame = reports.find("a:nth-child(1)").attr("href");
                secondGameObj = getGameObj(secondGame);
            } else {
                firstGame = reports.find("a:nth-child(1)").attr("href");
                firstGameObj = getGameObj(firstGame);
                secondGame = null;
                secondGameObj = null;
            }
            opposites = [{
                    name: oppositNames[0],
                    j: jOppositeUrl1
                },
                {
                    name: oppositNames[1],
                    j: jOppositeUrl2
                }
            ];
            const tv = $(game).find(selTv).find('a').attr("href");
            const tvObj = getTvObj(tv);

            data.push({
                roundID,
                opposites,
                games,
                secondGameObj,
                firstGameObj,
                tvObj
            });
        }

    });
    return data;
}


module.exports = getMatches;