const {selGroupFinalTable} = require('../parse/selectors');
const { getSearchParameter} = require('../utils/getters');

module.exports = html => {
    try {
      const teams = [];
      const $ = require('cheerio').load(html);
  
      $(selGroupFinalTable).each((i, team) => {
        const t = $(team);
        teams.push(getSearchParameter(t.attr("href"), "j"));
      });
      const teamPlaces = teams.join("|");
      return teamPlaces;
    } catch (error) {
      console.log(error.message)
    }
  }