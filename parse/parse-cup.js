
const { getHtml, getZ, getSearchParameter } = require('../utils/getters');
const { pefl, bodySelecor, cupRounds, roundGames, tournamentsPageRef, } = require('./selectors')
const getRoundList = require('../scrap-html/scrap-rounds-list');
const getMatches = require('../scrap-html/scrap-matches');

function ParseCup(_nightmare, cupUrl, _cupName, _season) {
  // function ParseCup(cupUrl, _cupName = "Ирландия. Кубок") {

  return new Promise(function (resolve, reject) {
    _nightmare
      .goto(cupUrl)
      .wait(cupRounds)
      .wait(2000)
      .evaluate(getHtml, bodySelecor)
      .then(response => {
        const tournamentList = _season
          ? getRoundList(response, _cupName, getSearchParameter(cupUrl, "j"))
          : getRoundList(response);

        return tournamentList;
      })
      .then(list => {
        const tFF = getSearchParameter(cupUrl, "j");
        const tType = getSearchParameter(cupUrl, "t");
        const tSeason = getSearchParameter(cupUrl, "f") || _season;
        const cupZ = getZ(cupUrl);
        const cupId = [tType, tFF, tSeason].join('_');
        // console.log(cupId, "--------------------  z", cupZ);
        const rounds = {};
        list.data.forEach(r => {
          const _round = { ff: r.ff, name: r.roundName };
          rounds[r.roundId] = _round;
        });

        list.hrefs.reduce(function (acc, url, index, arr) {
          return acc.then(function (rlt) {
            return _nightmare.goto(pefl + url)
              .wait(1000)
              .wait(roundGames)
              .evaluate(getHtml, bodySelecor)
              .then((roundsList) => {
                return rlt.concat(getMatches(list.data[index].roundId, roundsList))
              })
              .catch(err => { if (err) console.log(err) })
          });
        }, Promise.resolve([]))
          .then(results => {

            // console.log(cupId, "-", rounds);
            console.log(_cupName, " END  ", Array.isArray(results), results.length);
            // console.log("resolve  - ", { id: cupId, name: _cupName, z: cupZ, rounds: rounds, games: results });
            const response = { id: cupId, name: _cupName, z: cupZ, rounds: rounds, games: results, season: tSeason };
            if (list.groups) response.groups = list.groups;
            resolve(response);
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}


module.exports = ParseCup;