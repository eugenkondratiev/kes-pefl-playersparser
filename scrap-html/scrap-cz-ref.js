module.exports = html => {
    let data = [];
    const $ = require('cheerio').load(html);
    const cupA = $('a:contains("Чехия")');
    if (cupA[1]) {
        $(cupA).each((i, cup) => {
            data.push({ name: $(cup).text(), href: $(cup).attr("href") })
        });
        return data;
    } else {
        return cupA.attr('href');
    }
}