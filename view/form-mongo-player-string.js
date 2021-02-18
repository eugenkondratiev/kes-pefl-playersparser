// const peflSearcher = require('./pefl-searcher');


const pefl_host = 'plug.php';
const pefl = 'http://pefl.ru/';
const NATION_NAME_INDEX = 1;

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
    // const pretty = Object.assign({}, pl);
    // const { _id, name, nation, age, position, team, ff } = pl;
    const pretty = [];
    const {
        _id,
        name,
        nation,
        age,
        position,
        team,
        ff,
        school,
        pens,
        freeRef,
        _age = +age,
        ffId = +ff,
        nationId = +nation,
        teamId = +team,
    } = pl;
//####################
// console.log("### test  pl  - " , pl, nationId, teamId);

    const _nation = global.nationBase[nationId];
    let _ff, _club;
    // try {
    //     console.log("__nation - ", nationId, "\n\n", _nation)
    // } catch (error) {
    //     ;
    // }
    try {
        // console.log("__nation - ", nationId, "\n\n", _nation)

        _ff = ffId > -1 ? global.nationBase[ffId] : undefined;
        _club = teamId > 0 ? global.clubsBase[teamId] : undefined;
        // console.log(" _club - ", teamId, _club);

    } catch (error) {
        console.log("error _club _ff  ", error);
    }

    // TODO   - procceed ......
    pretty.push(
        freeRef ?
        `[url=${pefl + freeRef}]${name} [/url]` :
        name
    )
    pretty.push(`${_nation[NATION_NAME_INDEX]} [img]system/img/flags/mod/${nationId}.gif[/img]`);
    pretty.push(position + " " + _age);
    school ? pretty.push(`школьник`) : undefined;
    pens ? pretty.push(`пенс`) : undefined;
    _club
        ?
        pretty.push(`[url=${getClubUrl(teamId, _club[2])}]${_club[1]} [/url] [img]system/img/flags/mod/${ffId}.gif[/img]`) :
        pretty.push(`свободный`);

    return pretty.join(' | ')
}