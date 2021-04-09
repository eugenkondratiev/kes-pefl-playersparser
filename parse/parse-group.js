
// const getFfCup = require('../scrap-html/scrap-ff-cups');

const { pefl, bodySelecor } = require('./selectors');
const { getHtml , getSearchParameter , getZ} = require('../utils/getters');
const {selGroupTours, selGroupTable, selGroupToursList, selGroupTableList, roundGames} = require('../parse/selectors');

const getRoundList = require('../scrap-html/scrap-group-rounds');
const getMatches = require('../scrap-html/scrap-matches');
const getTable = require('../scrap-html/scrap-group');


module.exports = function (_nightmare, cupUrl, _cupName) {
    let urlGroupTable = '';
    let urlGroupTours = '';

    return new Promise(function (resolve, reject) {
        let season = 0;
        _nightmare
            .goto(cupUrl)
            .wait(selGroupTours)
            .evaluate(getHtml, bodySelecor)
            .then(response => {
                const $ = require('cheerio').load(response);
                urlGroupTours = pefl + $(selGroupTours).attr("href");
                urlGroupTable = pefl + $(selGroupTable).attr("href");
                season = getSearchParameter(urlGroupTours, "f");;
                // console.log("urlGroupTours - ", urlGroupTours);
                // console.log("urlGroupTable - ", urlGroupTable);

                _nightmare.goto(urlGroupTours)
                    .wait(selGroupToursList)
                    .wait(1000)
                    .evaluate(getHtml, bodySelecor)
                    .then(response => {
                        const tournamentList = getRoundList(response);
                        return tournamentList;
                    })
                    .then(list => {
                        const tFF = getSearchParameter(cupUrl, "j");
                        const tType = getSearchParameter(cupUrl, "t");
                        const tSeason = getSearchParameter(cupUrl, "f") || season;
                        const cupZ = getZ(cupUrl);
                        const cupId = [tType, tFF, tSeason].join('_');
                        const rounds = {};
                        list.data.forEach(r => {
                            const _round = { ff: r.ff, name: r.roundName };
                            rounds[r.roundId] = _round;
                        });

                        list.hrefs.reduce(function (acc, url, index, arr) {
                            return acc.then(function (results) {
                                return _nightmare.goto(pefl + url)
                                    .wait(500)
                                    .wait(roundGames)
                                    .evaluate(getHtml, bodySelecor)
                                    .then((roundsList) => {
                                        return results.concat(getMatches(list.data[index].roundId, roundsList))
                                    })
                                    .catch(err => { if (err) console.log(err) })
                            });
                        }, Promise.resolve([]))
                            .then(results => {
                                _nightmare.goto(urlGroupTable)
                                    .wait(selGroupTableList)
                                    .wait(3000)
                                    .evaluate(getHtml, bodySelecor)
                                    .then(response => {
                                        const placesString = getTable(response);
                                        resolve({ id: cupId, name: _cupName, z: cupZ, rounds: rounds, games: results, pl: placesString });
                                    })
                                    .catch(console.err);
                            })
                            .catch(err => {
                                console.log(err);
                                reject(err);
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    })
            })

            .catch(err => {
                console.log(err);
                reject(err);
            });
    });
}