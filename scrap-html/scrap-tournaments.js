const { tSelector } = require('../parse/selectors');
const { getParameter } = require('../utils/getters');


module.exports = (html) => {
  data = [];
  const $ = require('cheerio').load(html);
  const selFFs = tSelector + ' > tbody > tr';
  $(selFFs).each((i, row) => {
    const tds = $(row).find("td");
    if (tds.length > 2) {
      tds.each((j, _ff) => {
        const href = $(_ff).find("a").attr("href");
        try {
          const ffId = getParameter(href, "j");
          const t = getParameter(href, "t");
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