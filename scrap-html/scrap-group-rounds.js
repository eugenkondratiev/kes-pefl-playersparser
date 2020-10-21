const { selGroupToursList } = require('../parse/selectors');
const { getParameter, getRoundName, getSearchParameter } = require('../utils/getters');

module.exports = html => {
  try {
    const data = [];
    const hrefs = [];
   
    const $ = require('cheerio').load(html);
    const selRoundsList = selGroupToursList + ' > p:nth-child(2) > table > tbody a'
    // console.log('selRoundsList :>> ', selRoundsList);
    // console.log("$(selRoundsList) length", $(selRoundsList).length);
    let ff, roundId, label;

    $(selRoundsList).each((i, round) => {
      // console.log(" i round  - ", i, round);
      try {
        const roundRef = $(round).attr("href");
        // console.log('roundRef :>> ', roundRef);
        if (!roundRef) return;
        ff = getSearchParameter(roundRef, "j");
        roundId = getSearchParameter(roundRef, "n");
        label = $(round).text();
        const roundName = getRoundName(label)
        data.push({ ff, roundId, roundName, roundRef });
        hrefs.push(roundRef);
      } catch (error) {
        console.log("$(selRoundsList) scrap-group-round - ", error);
      }
    });

    const roundsList = { data: data, hrefs: hrefs };
    // console.log(`roundsList  ${ff} ${roundId} ${label}:>> `, roundsList);
    return roundsList;
  } catch (error) {
    console.log(" >>>> scrap-group-round - ", error);

  }

}