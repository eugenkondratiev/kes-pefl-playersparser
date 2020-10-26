
getPairs = async () => {
    try {
        const _client = await require('./db-mongo')();

        const _response = (await _client._db.collection('info').findOne({ "pairs": { $exists: true } })).pairs;
        // const _response = (await _client._db.collection('info').findOne({ "pairs": { $exists: true } },{ $project : { pairs : 1 }} )).pairs;
        // console.log('_response :>> ', _response);
        // const _playersOldBase = _response || [];
        // console.log(" ## OLD base ", _playersOldBase)
        // _client.client.close()
        return _response;

    } catch (error) {
        console.log(" ###  get-pairs-main-base  - ", error)
    }
}

module.exports = getPairs
