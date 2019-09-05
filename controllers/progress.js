const mongoClient = require('../models/index');

module.exports.initProgress = function(req,res) {
    let progress = {all:0, sleepers: [], mistresses: [], favorites: [], dark_evas: [], winners: [], key: "loveProgress"};

    mongoClient.connect(function(err, database){
        if(err){
            return console.log(err);
        }
        db = database.db("clientsdata");
        // взаимодействие с базой данных
        db.collection('evas').drop();
        db.collection('darkevas').drop();
        db.collection('progress').drop();
        db.collection('progress').insert(progress,function(err, result){
            if(err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(progress);
        });
    });
}

module.exports.getProgress = function(req, res){
    mongoClient.connect(function(err, database){
        if(err){
            return console.log(err);
        }
        db = database.db("clientsdata");
        // взаимодействие с базой данных
        db.collection('progress').findOne({ key: "loveProgress"}, function(err,docs){
            if(err){
                return console.log(err);
            }
            res.send(docs);
        });
    });
}