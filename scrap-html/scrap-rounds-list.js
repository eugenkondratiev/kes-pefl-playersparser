/*
getRoundList
*/
const { getParameter,getRoundName} = require('../utils/getters');
const { selID, cupRounds} = require('../parse/selectors');


module.exports =  html => {
    try {
      data = [];
      hrefs = [];
      const $ = require('cheerio').load(html);
      const selRoundsList = cupRounds + ' > tbody > tr'
  
      console.log("ID = ", $(selID).text().match(/(?<=\()\d+(?=й)/g)[0]);
  
      $(selRoundsList).each((i, round) => {
        const roundRef = $(round).find("td > a").attr("href");
        const ff = getParameter(roundRef, "j");
        const roundId = getParameter(roundRef, "n");
        const label = $(round).find("td").text();
        const roundName = getRoundName(label)
        data.push({ ff, roundId, roundName, roundRef });
        hrefs.push(roundRef);
      });
      const roundslist = { data: data, hrefs: hrefs };
      console.log("roundslist  parsed");
      // console.log("roundslist  - ", roundslist);
      return roundslist;
    } catch (error) {
      console.log(error.message);
  
    }
  
  }