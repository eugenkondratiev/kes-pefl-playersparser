const pefl = 'http://pefl.ru/';

const getHtml = (selector) => document.querySelector(selector).innerHTML;
const getParameter = (href, par) => href.match(new RegExp("(\?<=\\&" + par + "=)[\\w\\d]{1,6}(\?=\\&)", 'g'))[0];


const getRoundName = (href) => href.match(/[A-ЯЁЪа-яёъ\w\s\/]+(?=\()/g)[0].trim();

const getZ = (href) => {
    const url = new URL(href);
    return url.searchParams.get('z');
}
const getSearchParameter = (href, par) => {
    const theUrl = new URL( pefl + href);
    return theUrl.searchParams.get(par);
};
const getNumber = data => parseInt(String(data).replace(/[\$\.\,\s]+/ig,""));

const getGameObj = (href) => {
    const gameUrl = new URL( pefl + href);
    return { 'j': gameUrl.searchParams.get('j'), 'z': gameUrl.searchParams.get('z')};
}

const getTvObj = (href) => {
    const tvUrl = new URL( (pefl + href).replace('#/', '?'));
    return { 'j': tvUrl.searchParams.get('j'), 'z': tvUrl.searchParams.get('z')};
}

const tCodes = {
    "v" : [0,"Чемпионат"],
    "cup": [1,"Суперубок"],
    "supercup": [2,"Суперкубок"],
    "ec": [3,"Международный"],
    "ectov": [4,"ТоварищескийТурнир"],
    "f": [5,"Товарищеский"],
    "t": [6,"ФФ"],

};

module.exports = {
    getHtml,
     getParameter,
      getRoundName, 
      tCodes,
      getZ,
      getGameObj,
      getTvObj,
    getSearchParameter,
    getNumber
    };
// module.exports = {
//     getHtml: getHtml,
//      getParameter : getParameter,
//       getRoundName : getRoundName};