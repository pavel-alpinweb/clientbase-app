const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
var MongoClient = require('mongodb').MongoClient;
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');

  // authorized headers for preflight requests
  // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();

  app.options('*', (req, res) => {
      // allowed XHR methods  
      res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
      res.send();
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/index"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
});


var mongoClient = new MongoClient("mongodb://localhost:27017/clientstdata2", { useNewUrlParser: true });
mongoClient.connect(function(err, database){
    if(err){
        return console.log(err);
    }
    // взаимодействие с базой данных
    const server = app.listen(process.env.PORT || 6060, function() {
      console.log("Сервер запущен на порте: " + server.address().port);
    });
});