const {selGropToursList} = require('../parse/selectors');
const { getParameter,getRoundName, getSearchParameter} = require('../utils/getters');

module.exports = html => {
    try {
      data = [];
      hrefs = [];
      const $ = require('cheerio').load(html);
      const selRoundsList = selGropToursList + ' > p:nth-child(2) > table > tbody a'
  
      $(selRoundsList).each((i, round) => {
        try {
          const roundRef = $(round).attr("href");
          if (!roundRef) return;
          const ff = getSearchParameter(roundRef, "j");
          const roundId = getSearchParameter(roundRef, "n");
          const label = $(round).text();
          const roundName = getRoundName(label)
          data.push({ ff, roundId, roundName, roundRef });
          hrefs.push(roundRef);
        } catch (error) {
          console.log(error.message);
        }
      });
  
      const roundslist = { data: data, hrefs: hrefs };
  
      return roundslist;
    } catch (error) {
      console.log(error.message);
  
    }
  
  }