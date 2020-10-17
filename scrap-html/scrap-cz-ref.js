module.exports = html => {
    console.log('=======================================================');
    let data = [];
    const $ = require('cheerio').load(html);
    const cupA = $('a:contains("Чехия")');
    // console.log('Tcups object - ', cupA);
    console.log('Found  - ', cupA.length, ' results');
    if (cupA[1]) {
        $(cupA).each((i, cup) => {
            data.push({ name: $(cup).text(), href: $(cup).attr("href") })
        });
        return data;
    } else {
        return cupA.attr('href');
    }
}