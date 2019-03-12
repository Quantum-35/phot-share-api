const { MongoClient } = require('mongodb');
require('dotenv').config()

// Connect Mongo
let _db;
const mongoConnect = async (callback) => {
    try {
        client = await MongoClient.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
        _db = client.db();
        callback();
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw "No Database Found";
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;