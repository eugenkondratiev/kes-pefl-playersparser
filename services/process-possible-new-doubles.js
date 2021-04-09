const playersTree = require('../utils/create-players-bor');
const fs = require('fs');
const AGE_DIFFERENCE = 4;
const SEARCH_ONE_NATION = true;
const formPlayerString = require('../view/form-mongo-player-string');

const { selDbErrorsTopic, selDoublesTopic } = require('../parse/selectors')


module.exports = async (_newPlayers, _allBase) => {
    const _pairs = await require('../model/mongo/get-pairs-mongo')();
    console.log(' ###### Pairs  - ', _pairs);

    const nightmare = require('../parse/pefl-auth')();

    const doubles = []

    const {
        data: _bor,
        length: _borLength
    } = playersTree(_allBase);
    console.log('_bor.length :>> ', _borLength);

    fs.writeFile("data/__bor.json", JSON.stringify(_bor.getRoot(), null, " "), err => {
        if (err) console.log("writeFile error")
    });

    _newPlayers.forEach(pl => {
        const _possibleDoubles = _bor.findDouble(pl.name, _pairs);
        const _currentDoubles = _possibleDoubles.filter(dbl => Math.abs(+pl.age - dbl.age) <= AGE_DIFFERENCE)

        if (_currentDoubles.length > 1) {

            console.log(pl.name + '  doubles :>> ', _currentDoubles);
            const post = `Автоматический пост. Возможные дубликаты\n  
             ${
                _currentDoubles.reduce((acc, player,i)=>`${acc}\n  ${i+1} ${player._id} ${formPlayerString(player)}\n`, "")
                }`;
            require('./publish-post-to-pefl')({post:post, _nightmare:nightmare, topic:selDoublesTopic}).catch(err=>console.log("### publish error : ", err));
        }

        const _currentDoublesOneNation = _possibleDoubles.filter(dbl => Math.abs(+pl.age - dbl.age) <= AGE_DIFFERENCE && pl.nation == dbl.nation)

        if (_currentDoublesOneNation.length > 1) {
            console.log(pl.name + '  doubles :>> ', _currentDoublesOneNation);
            const post = `Автоматический пост. Возможные дубликаты\n  
             ${
                _currentDoublesOneNation.reduce((acc, player,i)=>`${acc}\n  ${i+1} ${player._id} ${formPlayerString(player)}\n`, "")
                }`;
            require('./publish-post-to-pefl')({post:post, _nightmare:nightmare, topic:selDbErrorsTopic}).catch(err=>console.log("### publish error : ", err));

        }
        
    });
    return doubles
}