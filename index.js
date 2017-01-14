// imports
var express = require("express");
var mongoose = require("mongoose");
var assert = require("assert");
var bodyParser = require("body-parser");

// global constants
const appPort = 8080;
const mongoPort = 27017;
const mongoDatabase = "test";
// the lack of string interpolation support on older versions of Node makes me sad
const mongoUrl = "mongodb://localhost:" + mongoPort + "/" + mongoDatabase;
const mongoCollection = "phrases";

var app = express();
mongoose.connect(mongoUrl);
var db = mongoose.connection;

// server config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", express.static("public"));

app.get("/api/phrase/all", function(req, res) {
    var collection = db.collection(mongoCollection);
    console.log("Searching collection '" + mongoCollection + "'...");
    var query = {};
    var items = collection.find(query, {"phrase": 1, "_id": 0 }).toArray(function(err, items) {
        assert.equal(null, err);
        var phrases = items.map(function(item) {
            return item.phrase;
        });
        console.log(phrases); 
        res.json(phrases).end();
    });
});

app.delete("/api/phrase/all", function(req, res) {
    console.log("Deleting all phrases...");
    var collection = db.collection(mongoCollection);
    collection.remove({}, function(err) {
        assert.equal(null, err);
        res.json({"status": "ok"}).end();
    });
});

/**
 * Post bingo phrases
 */
app.post("/api/phrase", function(req, res) {
    // TODO create collections on first run
    if(!req.body.phrase) {
        res.status(400).json({
            "status": "error",
            "message": "phrase is a required parameter"
        }).end();
        return;
    }

    var collection = db.collection(mongoCollection);
    collection.insert({"phrase": req.body.phrase}, function(err, result) {
        assert.equal(null, err);
        res.json({"status": "ok"}).end();
    });
});

app.listen(appPort, function() {
    console.log("Started listening on port " + appPort);
});
