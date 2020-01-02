const mongoClient = require('../models/index');
const del = require('del');

module.exports.initProgress = function(req,res) {
    let progress = {all:0, sleepers: [], currents: [], favorites: [], dark_evas: [], winners: [], key: "clientsProgress"};

    mongoClient.connect(function(err, database){
        if(err){
            return console.log(err);
        }
        db = database.db("clientsdata2");
        // взаимодействие с базой данных
        db.collection('evas').drop();
        db.collection('darkevas').drop();
        db.collection('progress').drop();
        db.collection('history').drop();
        del.sync('public/content/**');
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
        db = database.db("clientsdata2");
        // взаимодействие с базой данных
        db.collection('progress').findOne({ key: "clientsProgress"}, function(err,docs){
            if(err){
                return console.log(err);
            }
            res.send(docs);
        });
    });
}

module.exports.getAllEvas = function (req, res) {
    mongoClient.connect(async function(err, database){
        if(err){
            return console.log(err);
        }
        db = database.db("clientsdata2");
        // взаимодействие с базой данных
        const evas = await db.collection('evas').find().toArray();
        const darkEvas = await db.collection('darkevas').find().toArray();
        const allEvas = evas.concat(darkEvas);
        res.send(allEvas);
    });   
}