
const Bor = require('./bor');
const normName = require('./normalize-name')

module.exports = (playersBase) => {
    const tree = new Bor();
    console.time("create bor");
    let _playersInBor = 0;
    playersBase.forEach((element, i) => {
        tree.addNode({ word: normName(element.name), data: element })
        _playersInBor++;
    });
    console.timeLog("create bor");
    return { data: tree, length: _playersInBor }

}
