const findIfSamePlayer = (pl1, pl2) => {
    return pl1.name === pl2.name && pl1.nation === pl2.nation && pl1.age === pl2.age && pl1.position === pl2.position
}

function compareBases(_old, _new) {
    console.log("  ### _old.length, _new.length  - " , _old.length, _new.length);
    // console.log(_old[1], _new[1]);
    const sameRecordsByIdAndName = _new.filter((pl, i) => {
        // if (i === 1488) {
        //     console.log(pl, i, _old[i]);
        //     console.log(pl._id === _old[i]._id);
        //     console.log(pl.name === _old[i].name);
        // }
        return _old[i] && pl._id === _old[i]._id && pl.name === _old[i].name
    });
    const differentRecordsByIdAndName = _new.filter((pl, i) => !_old[i] || pl._id !== _old[i]._id || pl.name !== _old[i].name);

    const oldLength = sameRecordsByIdAndName.length;
    console.log(oldLength, differentRecordsByIdAndName.length, sameRecordsByIdAndName.length + differentRecordsByIdAndName.length);
    console.log(differentRecordsByIdAndName);
    const playersWithChanges = [];
    const playersMovedByOrder = [];

    differentRecordsByIdAndName.forEach((pl, i) => {
        _old.some(oldPlayer => findIfSamePlayer(oldPlayer, pl)) ? playersMovedByOrder.push(pl) :playersWithChanges.push(pl);
    }
    )

    // console.log("playersWithChanges - ", playersWithChanges.length);
    // console.log("playersMOvedByOrde - ", playersMovedByOrder.length);
    return { same: sameRecordsByIdAndName, diff: differentRecordsByIdAndName, changed: playersWithChanges, moved: playersMovedByOrder }
}




module.exports = compareBases