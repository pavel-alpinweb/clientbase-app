const mongoClient = require('../models/index');
var multiparty = require('multiparty');
const fs = require("fs");

let saveEvaInDB = async (db, eva, res) => {
    try {
        await db.collection('progress').update({ key: "loveProgress"}, { $inc : { all: 1 } });
        let progress = await db.collection('progress').findOne({ key: "loveProgress"});
        eva.id = "eva0" + progress.all;
        await db.collection('evas').insert(eva);
        let result = await db.collection('evas').find().toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

let updateEvaInDB = async (db, eva, res) => {
    try {
        await db.collection('evas').updateOne({ id: eva.id }, { $set: eva });
        let result = await db.collection('evas').find().toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

let setPenaltyInDB = async (db, eva, res) => {
    try {
        await db.collection('evas').updateOne({ id: eva.id }, { $set: {penalty: eva.penalty} });
        let result = await db.collection('evas').find().toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

let archiveEvaInDB = async (db, eva, res) => {
    try {
        await db.collection('evas').deleteOne({ id: eva.id });
        eva.isActive = false;
        await db.collection('darkevas').insert(eva);
        let progress = await db.collection('progress').findOne({ key: "loveProgress"});
        let isFind = await progress.dark_evas.findIndex( element => {return element.id == eva.id});
        if(isFind == -1){
            await db.collection('progress').update({ key: "loveProgress"}, { $push : { dark_evas: eva } });
        }
        let result = await db.collection('evas').find().toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

let moveEvaInDB = async (db, eva, res) => {
    try {
        await db.collection('evas').updateOne({ id: eva.id }, { $set: {status: eva.move} });
        let progress = await db.collection('progress').findOne({ key: "loveProgress"});
        if(eva.move == 'mistress') {
            let isFind = await progress.mistresses.findIndex( element => {return element.id == eva.id});
            if(isFind == -1){
                await db.collection('progress').update({ key: "loveProgress"}, { $push : { mistresses: eva } });
            }
        } else if(eva.move == 'friend'){
            let isFind = await progress.friends.findIndex( element => {return element.id == eva.id});
            if(isFind == -1){
                await db.collection('progress').update({ key: "loveProgress"}, { $push : { friends: eva } });
            }
        } else if(eva.move == 'favorite'){
            let isFind = await progress.favorites.findIndex( element => {return element.id == eva.id});
            if(isFind == -1){
                await db.collection('progress').update({ key: "loveProgress"}, { $push : { favorites: eva } });
            }
        }
        let result = await db.collection('evas').find().toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

let winnEvaInDB = async (db, eva, res) => {
    try {
        await db.collection('evas').updateOne({ id: eva.id }, { $set: {status: 'winner'} });
        let progress = await db.collection('progress').findOne({ key: "loveProgress"});
        let isFind = await progress.winners.findIndex( element => {return element.id == eva.id});
        if(isFind == -1){
            await db.collection('progress').update({ key: "loveProgress"}, { $push : { winners: eva } });
        }
        let result = await db.collection('evas').find().toArray();
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
            mongoClient.connect(function(err, database){
            if(err){
                 return console.log(err);
            }
            db = database.db("girlsdata");
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

module.exports.addEva = function (req, res) {
    saveEvaData(req, res, saveEvaInDB);
}

module.exports.setEva = function (req, res) {
    saveEvaData(req, res, updateEvaInDB);
}

module.exports.setPenalty = function (req, res) {
    saveEvaData(req, res, setPenaltyInDB);
}

module.exports.archiveEva = function (req, res) {
    saveEvaData(req, res, archiveEvaInDB);
}
module.exports.moveEva = function (req, res) {
    saveEvaData(req, res, moveEvaInDB);
}

module.exports.finishGame = function (req, res) {
    saveEvaData(req, res, winnEvaInDB);
}

module.exports.getEvas = function (req, res) {
    mongoClient.connect(function(err, database){
        if(err){
            return console.log(err);
        }
        db = database.db("girlsdata");
        // взаимодействие с базой данных
        db.collection('evas').find().toArray(function(err, docs){
            if(err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.send(docs);
        });
    });   
}