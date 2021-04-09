const { tSelector } = require('../parse/selectors');
const { getSearchParameter } = require('../utils/getters');

const getCupsRefs = html => {
    data = [];
    ec = [];

    const $ = require('cheerio').load(html);
    const selFFs = tSelector + ' td';
    $(selFFs).each((i, element) => {
        const label = $(element).text();
        const href = $(element).find('a').attr('href');
        let cupType;
        let t_id;
        try {
            cupType = getSearchParameter(href, "t");
            t_id = getSearchParameter(href, "j");

            if (cupType === "t") {
                data.push([label + ".", href]);
            }
            if (cupType === 'ec') {
                ec.push([label, href]);
            }

        } catch (error) {
            console.log(error.message)
        }
    });
    return { cups: data, ec: ec };

}

module.exports = getCupsRefs