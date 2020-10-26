// const peflSearcher = require('./pefl-searcher');


const pefl_host = 'plug.php';
const pefl = 'http://pefl.ru/';

const getClubUrl = (_j, _z) => {
    const clubURL = new URL(pefl + pefl_host);
    clubURL.search = new URLSearchParams([
        ['p', 'refl'],
        ['t', 'k'],
        ['j', _j],
        ['z', _z],
    ]);
    return clubURL.toString();
};

module.exports = (pl) => {
    //
    const pretty = Object.assign({}, pl);
    const { _id, name, nation, age, position, team, ff } = pl;

    const _nation = global.nationBase[parseInt(nation)];
    const _club = global.clubsBase[parseInt(team)];
// TODO   - procceed ......

    // pretty[1] = _nation[1];
    pretty[4] = pl[4] == 0 ? "-" : pl[4] == 2 ? "шк" : "пенс";
    if (pl[4] == 1) pretty[7] = pefl + pl[7];
    pretty[8] = _club ? _club[1] : " свободный ";
    // pretty[9] = _club ?_club[2] : "";
    pretty[9] = _club ? getClubUrl(pl[5], _club[2]) : "";
    pretty[10] = _nation[1];
    pretty[11] = pl[6] == -1 ? "-1" : global.nationBase[pl[6]][1];

    return pretty
}