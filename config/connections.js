const mongoClient = require('mongodb').MongoClient;
const state = { db: null };

module.exports.connect = (done) => {
    const url = 'mongodb://localhost:27017';
    const dbName = 'Shopping';

    try {
        const client = new mongoClient(url);
        state.db = client.db(dbName);
        done();
    } catch (error) {
        done(error);
    }
}

module.exports.get = function () {
    return state.db;
}
