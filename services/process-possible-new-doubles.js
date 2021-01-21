const playersTree = require('../utils/create-players-bor');
const fs = require('fs');
const AGE_DIFFERENCE = 3;
const formPlayerString = require('../view/form-mongo-player-string');


module.exports = async (_newPlayers, _allBase) => {
    const _pairs = await require('../model/mongo/get-pairs-mongo')();

    const nightmare = require('../parse/pefl-auth')();

    const doubles = []
    const { data: _bor, length: _borLength } = playersTree(_allBase);
    // console.log('_bor :>> ', _bor);
    fs.writeFile("data/__bor.json", JSON.stringify(_bor.getRoot(), null, " "), err => { if (err) console.log("writeFile error") });

    _newPlayers.forEach(pl => {
        const _currentDoubles = _bor.findDouble(pl.name, _pairs).filter(dbl => Math.abs(+pl.age - dbl.age) <= AGE_DIFFERENCE)
        if (_currentDoubles.length < 2) return;
        console.log("------------------------------");
        console.log(pl.name + '  doubles :>> ', _currentDoubles);
        const post = `Тест. Автоматический пост. Возможные дубликаты\n  
         ${
            // JSON.stringify(_currentDoubles, null, " ")
            _currentDoubles.reduce((player,i)=>`${i+1} ${player._id} ${formPlayerString(player)}\n`, "")
            }`;
        require('./publish-post-to-pefl')(post, nightmare);
    });

    // fs.readFile('data/currentDifferentPlayers/currentDifferentPlayers-2020-10-20.json', (err, data) => {
    //     if (err) {
    //         console.log('err :>> ', err); return
    //     }
    //     const _newPlayers = JSON.parse(data);
    //     try {

    //         _newPlayers.forEach(async pl => {
    //             const _currentDoubles = _bor.findDouble(pl.name, _pairs).filter(dbl => Math.abs(+pl.age - dbl.age) <= AGE_DIFFERENCE)
    //             if (_currentDoubles.length < 2) return;
    //             console.log("------------------------------");
    //             console.log(pl.name + '  doubles :>> ', _currentDoubles);
    //             const post = `Тест. 
    //             Автоматический пост.
    //              Возможные дубликаты\n  
    //              ${JSON.stringify(_currentDoubles, null, " ")}`;
    //             await require('./publish-post-to-pefl')(post, nightmare);

    //         });
    //     } catch (error) {
    //         console.log(' testPlayers double find error :>> ', error);
    //     }
    // })

    return doubles
}