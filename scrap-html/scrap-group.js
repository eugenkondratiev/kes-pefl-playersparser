const {selGroupFinalTable} = require('../parse/selectors');
const { getSearchParameter} = require('../utils/getters');

module.exports = html => {
    try {
      const teams = [];
      const $ = require('cheerio').load(html);
  
      $(selGroupFinalTable).each((i, team) => {
        const t = $(team);
        console.log(i, t.text(), t.attr("href"));
        teams.push(getSearchParameter(t.attr("href"), "j"));
      });
      console.log("teams - ", teams);
      const teamPlaces = teams.join("|");
      console.log("Places string - ", teamPlaces)
      return teamPlaces;
    } catch (error) {
      console.log(error.message)
    }
  }