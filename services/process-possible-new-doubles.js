const playersTree = require('../utils/create-players-bor');
const fs = require('fs');
const AGE_DIFFERENCE = 3;
const formPlayerString = require('../view/form-mongo-player-string');


module.exports = async (_newPlayers, _allBase) => {
    const _pairs = await require('../model/mongo/get-pairs-mongo')();
    console.log(' ###### Pairs  - ', _pairs);

    const nightmare = require('../parse/pefl-auth')();

    const doubles = []

    const {
        data: _bor,
        length: _borLength
    } = playersTree(_allBase);
    console.log('_bor :>> ', _borLength);

    fs.writeFile("data/__bor.json", JSON.stringify(_bor.getRoot(), null, " "), err => {
        if (err) console.log("writeFile error")
    });
    // try {
    //     console.log("### test player string  :  ", formPlayerString(_newPlayers[0]));
    // } catch (error) {
    //     console.log("## No new players - ", error)
    // }

    _newPlayers.forEach(pl => {
        const _currentDoubles = _bor.findDouble(pl.name, _pairs).filter(dbl => Math.abs(+pl.age - dbl.age) <= AGE_DIFFERENCE)
        // console.log(`${pl.name} - _currentDoubles.length  - ${_currentDoubles.length}`);

        if (_currentDoubles.length < 2) return;
        console.log("------------------------------");
        console.log(pl.name + '  doubles :>> ', _currentDoubles);
        const post = `Автоматический пост. Возможные дубликаты\n  
         ${
            // JSON.stringify(_currentDoubles, null, " ")
            _currentDoubles.reduce((acc, player,i)=>`${acc}\n  ${i+1} ${player._id} ${formPlayerString(player)}\n`, "")
            }`;
        require('./publish-post-to-pefl')(post, nightmare);
    });
    return doubles
}