
getPairs = async () => {
    try {
        const _client = await require('./db-mongo')();
        const _response = (await _client._db.collection('info').findOne({ "pairs": { $exists: true } })).pairs;
        return _response;
    } catch (error) {
        console.log(" ###  get-pairs-main-base  - ", error)
    }
}

module.exports = getPairs
