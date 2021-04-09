const { getParameter } = require('../utils/getters');

module.exports =  html => {
    const $ = require('cheerio').load(html);
    const cupA = $('a:contains("Суперкубок")');
    return getParameter(cupA.attr('href'), "f");

}