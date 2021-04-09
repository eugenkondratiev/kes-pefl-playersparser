/*
getRoundList
*/
const { getParameter,getRoundName, getSearchParameter} = require('../utils/getters');
const { selID, cupRounds, cupGroups} = require('../parse/selectors');

module.exports =  (html,_tournamentName, _tournamentNumber) => {
    try {
      data = [];
      hrefs = [];
      const $ = require('cheerio').load(html);
      const selRoundsList = cupRounds + ' > tbody > tr'
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

      if (_tournamentNumber) { // for Eurocup
        const groups = [];
        const grHrefs = [];
        const groupsRefs = cupGroups;
    
        $(groupsRefs).each((i, group) => {
          const gr = $(group).text();
          const teams = gr.split(' | ');
          if (teams[1]) {
            const name = teams[0];
            const groupRef = $(group).attr('href');
            const groupLetter = name.slice(-1);
            const groupId = getSearchParameter(groupRef, 'j');
    
            groups.push({ name: _tournamentName + ". Группа " + groupLetter, j: groupId, gr: teams.join('|'), ref: groupRef, tournament: _tournamentNumber });
            grHrefs.push(groupRef);
          }
        })
        roundslist.groups = { data: groups, hrefs: grHrefs };
      }
      return roundslist;
    } catch (error) {
      console.log(error.message);
  
    }
  
  }