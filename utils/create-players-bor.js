
const Bor = require('./bor');
const normName = require('./normalize-name')

module.exports = (playersBase) => {
    const tree = new Bor();
    console.time("create bor");

    let _playersInBor = 0;
    playersBase.forEach((element, i) => {
        if (i===0) console.log(i, element);
        tree.addNode({ word: normName(element.name), data: element })
        _playersInBor++;
    });
    console.timeLog("create bor");
    console.log("_players in a bor ", _playersInBor);
    return { data: tree, length: _playersInBor }

}
