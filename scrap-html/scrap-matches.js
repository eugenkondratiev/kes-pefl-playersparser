
const { getParameter, getTvObj, getGameObj} = require('../utils/getters');
const { selTv, selOpposites, selGames, roundGames, } = require('../parse/selectors')


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
        let oppositeUrl2;
        let oppositeUrl1;
        let oppositNames;
        let games = (reports.text().match(/ \(/))
            ? reports.text().replace(/[\(\)]/g, "").split(" ")
            : reports.text();

        if (games !== 'Отчет') {
            oppositNames = gameString.split(" - ");

            if (reports.text().match(/ \(/)) {

                firstGame = reports.find("a:nth-child(2)").attr("href");
                firstGameObj = getGameObj(firstGame);
                secondGame = reports.find("a:nth-child(1)").attr("href");
                secondGameObj = getGameObj(secondGame);

                oppositeUrl2 = $(game).find("td:nth-child(1) > a:nth-child(2)").attr("href");
                oppositeUrl1 = $(game).find("td:nth-child(1) > a:nth-child(1)").attr("href");

            } else {
                oppositeUrl2 = $(game).find("td:nth-child(1) > a:nth-child(2)").attr("href");
                oppositeUrl1 = $(game).find("td:nth-child(1) > a:nth-child(1)").attr("href");

                firstGame = reports.find("a:nth-child(1)").attr("href");
                firstGameObj = getGameObj(firstGame);
                secondGame = null;
                secondGameObj = null;
            }

            opposites = [
                { name: oppositNames[0], j: getParameter(oppositeUrl1, "j") },
                { name: oppositNames[1], j: getParameter(oppositeUrl2, "j") }
            ];
            const tv = $(game).find(selTv).find('a').attr("href");
            const tvObj = getTvObj(tv);

            data.push({ roundID, opposites, games, secondGameObj, firstGameObj, tvObj });
        }

    });
    return data;
}


module.exports = getMatches;