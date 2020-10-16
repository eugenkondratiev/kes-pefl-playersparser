// const cheerio = require('cheerio');
const { tSelector } = require('../parse/selectors');
// const cheerio = require('cheerio');
const { getParameter } = require('../utils/getters');


module.exports = (html) => {
  data = [];
  const $ = require('cheerio').load(html);
  // console.log(html);
  const selFFs = tSelector + ' > tbody > tr';
  // console.log('=======================================================');
  // console.log($(selFFs).html());
  $(selFFs).each((i, row) => {
    const tds = $(row).find("td");
    // console.log(i, tds.length, $(row).is("td:nth-child(1)"));

    if (tds.length > 2) {
      tds.each((j, _ff) => {
        const href = $(_ff).find("a").attr("href");
        try {
          const ffId = getParameter(href, "j");
          const t = getParameter(href, "t");
          // console.log($(_ff).text(), href, ffId, t);
          if (t === 't') {
            data.push([ffId, $(_ff).text().trim()]);
          }
        } catch (error) {
          console.log("scrap tournaments error : ", error)
        }
      })
    };
  });

  data.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
  return data;
}