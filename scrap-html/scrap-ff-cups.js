const getFfCup = (html, ffName) => {
    let data = [];
    const $ = require('cheerio').load(html);
   // const cupA = $('a:contains("убок")');

	const cupA = $('a[href*=cup]');

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