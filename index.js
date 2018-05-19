// imports
const express = require("express");
const bodyParser = require("body-parser");

const meetingBingo = require("./server-modules/meeting-bingo.js");

// global constants
const appPort = 8081;

const app = express();
const session = require("express-session");
app.use(session({
	resave: false,
	saveUninitialized: true,
	// there is no secret data here so this doesn't really matter
	secret: "foo",
}));

// server config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", express.static("public"));

app.get("/api/phrase/all", meetingBingo.getAllPhrases);
app.post("/api/phrase", meetingBingo.postPhrase);
app.delete("/api/phrase/all", meetingBingo.deleteAllPhrases);
app.delete("/api/phrase/:phraseId", meetingBingo.deletePhrase);

// work-around
app.use("/node_modules/bootstrap/dist", express.static("node_modules/bootstrap/dist"));

app.listen(appPort, function() {
	console.log("Started listening on port " + appPort);
});
