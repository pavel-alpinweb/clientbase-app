const mongoClient = require('../models/index');
var multiparty = require('multiparty');
const fs = require("fs");

let updateDarkEvaInDB = async (db, eva, res) => {
    try {
        await db.collection('darkevas').updateOne({ id: eva.id }, { $set: eva });
        let result = await db.collection('darkevas').find().toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

let moveDarkEvaInDB = async (db, eva, res) => {
    try {
        await db.collection('darkevas').deleteOne({ id: eva.id });
        let progress = await db.collection('progress').findOne({ key: "loveProgress"});
        if(eva.move == 'mistress') {
            let isFind = await progress.mistresses.findIndex( element => {return element.id == eva.id});
            if(isFind == -1){
                await db.collection('progress').update({ key: "loveProgress"}, { $push : { mistresses: eva } });
            }
        } else if(eva.move == 'sleep'){
            let isFind = await progress.sleepers.findIndex( element => {return element.id == eva.id});
            if(isFind == -1){
                await db.collection('progress').update({ key: "loveProgress"}, { $push : { sleepers: eva } });
            }
        } else if(eva.move == 'favorite'){
            let isFind = await progress.favorites.findIndex( element => {return element.id == eva.id});
            if(isFind == -1){
                await db.collection('progress').update({ key: "loveProgress"}, { $push : { favorites: eva } });
            }
        }
        eva.status = eva.move;
        eva.isActive = true;
        await db.collection('evas').insert(eva);
        let result = await db.collection('darkevas').find().toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

function saveEvaData(req, res, dbfunction){
    // create a form to begin parsing
    var form = new multiparty.Form();
    var uploadFile = {uploadPath: '', filename: false};
    var errors = [];
    var eva = {};
    form.on('error', function(err){
        if(fs.existsSync(uploadFile.path)) {
            fs.unlinkSync(uploadFile.path);
            console.log('error');
        }
    });

    form.on('close', function() {
        if(errors.length == 0) {
            if (uploadFile.filename){
                eva.image = 'http://localhost:3030/content/' + uploadFile.filename;
            }
            eva.isActive = false;
            mongoClient.connect(function(err, database){
            if(err){
                 return console.log(err);
            }
            db = database.db("clientsdata");
                dbfunction(db, eva, res);
            });
        } else {
            if(fs.existsSync(uploadFile.path)) {
                fs.unlinkSync(uploadFile.path);
            }
            res.sendStatus(500);
        }
    });

    form.on('field', function (name, value) {
        if(name == "isActive"){
            eva[name] = Boolean(value);
        } else {
            eva[name] = value;
        }
    });

    // listen on part event for image file
    form.on('part', function(part) {
        if(part.filename){
            uploadFile.path = "./public/content/" + part.filename;
            uploadFile.filename = part.filename;
            if(errors.length == 0) {
                var out = fs.createWriteStream(uploadFile.path);
                part.pipe(out);
            }
            else {
                part.resume();
            }
        }
    });

    // parse the form
    form.parse(req); 
}

module.exports.setDarkEva = function (req, res) {
    saveEvaData(req, res, updateDarkEvaInDB);
}

module.exports.moveDarkEva = function (req, res) {
    saveEvaData(req, res, moveDarkEvaInDB);
}

module.exports.getDarkEvas = function (req, res) {
    mongoClient.connect(function(err, database){
        if(err){
            return console.log(err);
        }
        db = database.db("clientsdata");
        // взаимодействие с базой данных
        db.collection('darkevas').find().toArray(function(err, docs){
            if(err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(docs);
        });
    });   
}