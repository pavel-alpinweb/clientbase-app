var MongoClient = require('mongodb').MongoClient;
var mongoClient = new MongoClient("mongodb+srv://pavel-alpinweb:picK28611@myfirstcluster-3rdem.azure.mongodb.net/clientstdata", { useNewUrlParser: true });

module.exports = mongoClient;