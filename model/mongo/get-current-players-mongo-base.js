module.exports = async () => {
    try {
        const _client = await require('./db-mongo')();
        const _response = await _client._db.collection('allbase').find({}).toArray();
        const _playersOldBase = _response || [];
        console.log(" ## OLD base ", _playersOldBase.length)
        return _playersOldBase;
    } catch (error) {
        console.log(" ###  get-current-players-main-base  - ", error)
    }
}