module.exports = (playersFromPefl)=>{
    const lastplayer = playersFromPefl.length - 1;
    console.log("lastplayer   ", lastplayer);

    return playersFromPefl.map((n, i) => {
        const [_id, name, nation, age, position, type, team, ff, href] = n;
        const playerRecord = {
            _id,
            name,
            nation,
            age,
            position,
            team,
            ff
        };
        if (type === '1') playerRecord.pens = true;
        if (type === '2') playerRecord.school = true;
        if (href && href != -1) playerRecord.freeRef = href;
        if (i === lastplayer) {
            console.log(i, "i === lastplayer", playerRecord)

            // yep(null);
        }

        return playerRecord
    });
}