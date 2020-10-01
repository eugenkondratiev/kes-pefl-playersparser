const ALL_BASE_QUERY = "SELECT * from pefl.players";

const dbQuery = require('./db2').dbQuery;

module.exports = async ()=>{
    try {
     
    const _response = await dbQuery(ALL_BASE_QUERY);
    const _playersOldBase = _response.rows || [];
    // console.log(" ## OLD base ", _playersOldBase)
    console.log(" ## OLD base ", _playersOldBase.length)
    return _playersOldBase;
       
    } catch (error) {
        console.log(" ###  get-current-players-main-base  - ", error)
    }
}