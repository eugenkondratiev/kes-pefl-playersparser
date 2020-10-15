const { tSelector } = require('../parse/selectors');
// const cheerio = require('cheerio');
const { getSearchParameter } = require('../utils/getters');

const getCupsRefs = html => {
    data = [];
    ec = [];

    const $ = require('cheerio').load(html);
    // console.log(html);
    const selFFs = tSelector + ' td';
    console.log('=======================================================');
    console.log(selFFs);
    console.log('=======================================================');

    console.log($(selFFs).html());
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
        console.log(label, "        ", href, "    ", cupType, "   ", t_id);


    });
    console.log('=======================================================');

    return { cups: data, ec: ec };

}

module.exports = getCupsRefs