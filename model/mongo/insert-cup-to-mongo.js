// const pefl = 'http://pefl.ru/';

// const COLLECTION = 'clubs';


async function insertToMongo(data) {
    let mongoClient;
    // const collection = mongoClient._db.collection(COLLECTION);
    try {
        mongoClient = await require('./db-mongo')();

        const rlt = await mongoClient
            ._db
            .collection("cups")
            .updateOne(
                { _id: data._id },
                { $set: data },
                { upsert: true }
            );
        // console.log('##### HOST ####', dbSeason);
    } catch (err) {
        console.log("insertToMongo errro", err);
        mongoClient.client.close();
    }
    finally {
        mongoClient.client.close();
        ;
        // setTimeout(() => {
        // }, 5000);
    }
}

module.exports = insertToMongo;
