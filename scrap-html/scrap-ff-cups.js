const getFfCup = (html, ffName) => {
    // console.log('=======================================================');
    let data = [];
    const $ = require('cheerio').load(html);
    const cupA = $('a:contains("убок")');
    // console.log('Tcups object - ', cupA);
    // console.log(`${ffName}  has ${ cupA.length} cups `);
    if (cupA[1]) {
        $(cupA).each((i, cup) => {
            data.push({ name: ffName + $(cup).text(), href: $(cup).attr("href") })
        });
        return data;
    } else {
        return cupA.attr('href');
    }
}

module.exports = getFfCup;