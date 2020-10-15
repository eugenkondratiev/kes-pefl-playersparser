const { getParameter } = require('../utils/getters');

module.exports =  html => {
    // console.log('=======================================================');
    // let data = [];
    const $ = require('cheerio').load(html);
    const cupA = $('a:contains("Суперкубок")');
    // console.log('Tcups object - ', cupA);
    return getParameter(cupA.attr('href'), "f");

}