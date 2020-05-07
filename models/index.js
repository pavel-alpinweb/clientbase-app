var MongoClient = require('mongodb').MongoClient;
var mongoClient = new MongoClient("mongodb+srv://pavel-alpinweb:picK28611@myfirstcluster-3rdem.azure.mongodb.net/clientsdata", { useNewUrlParser: true });

module.exports = mongoClient;