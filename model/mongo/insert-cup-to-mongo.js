// const pefl = 'http://pefl.ru/';

// const COLLECTION = 'clubs';


async function insertToMongo(data) {
    let mongoClient;
    try {
        mongoClient = await require('./db-mongo')();

        const rlt = await mongoClient
            ._db
            .collection("cups")
            .updateOne({
                _id: data._id
            }, {
                $set: data
            }, {
                upsert: true
            });
    } catch (err) {
        console.log("insertToMongo errro", err);
        mongoClient.client.close();
    } finally {
        mongoClient.client.close();;
    }
}

module.exports = insertToMongo;