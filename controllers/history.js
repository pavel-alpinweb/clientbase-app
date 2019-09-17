const mongoClient = require('../models/index');


module.exports.getPastEvas = function (req, res) {
    mongoClient.connect(function(err, database){
        if(err){
            return console.log(err);
        }
        db = database.db("clientsdata");
        // взаимодействие с базой данных
        db.collection('history').find().toArray(function(err, docs){
            if(err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(docs);
        });
    });   
}