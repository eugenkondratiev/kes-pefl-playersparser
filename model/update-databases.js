module.exports = async results => {
    try {
        require('./update-cup-bd')(results);
    } catch (error) {
        console.log("/update-cup-bd error - ", error);
    }
    try {
        const mongoRecord = await require('./mongo/_cup_results_to_mongo_object')(results);
        // console.log("model/insert-cup-to-mongo  - ", mongoRecord._id, mongoRecord.name);
        await require('./mongo/insert-cup-to-mongo')(mongoRecord);
    } catch (error) {
        console.log("model/insert-cup-to-mongo error  - ", error)
    }

}