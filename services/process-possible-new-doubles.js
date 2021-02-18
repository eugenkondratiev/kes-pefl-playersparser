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
    try {
        // console.log("### test player string  :  ", formPlayerString(_newPlayers[0]));
        const testDoubles = [{
                _id: 54679,
                name: 'Илья Шевцов',
                nation: '200',
                age: '22',
                position: 'LC MF',
                team: '870',
                ff: '192'
            },
            {
                _id: 59194,
                name: 'Илья Шевцов',
                nation: '200',
                age: '19',
                position: 'LCR DM',
                team: '1355',
                ff: '200',
                school: true
            }
        ]
        console.log("------ try to form test post  - ");

        const post = `Тест. Автоматический пост. Возможные дубликаты\n  
        ${
           // JSON.stringify(_currentDoubles, null, " ")
           testDoubles.reduce((acc, player,i)=>`${acc}\n  ${i+1} ${player._id} ${formPlayerString(player)}\n`, "")
           }`;

        console.log("#####  test post  - ", post);


    } catch (error) {
        console.log("## No new players - ", error)
    }
    _newPlayers.forEach(pl => {
        const _currentDoubles = _bor.findDouble(pl.name, _pairs).filter(dbl => Math.abs(+pl.age - dbl.age) <= AGE_DIFFERENCE)
        console.log(`${pl.name} - _currentDoubles.length  - ${_currentDoubles.length}`);

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