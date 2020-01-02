var MongoClient = require('mongodb').MongoClient;
var mongoClient = new MongoClient("mongodb://localhost:27017/clientstdata2", { useNewUrlParser: true });

module.exports = mongoClient;