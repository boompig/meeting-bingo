const stockPhrases = require("./stock-phrases").phrases;

const MeetingBingo = function MeetingBingo() {

	let resetUserSession = (req) => {
		console.log("Resetting user session");
		const phrases = {};
		for(let i = 0; i < stockPhrases.length; i++) {
			phrases[i] = stockPhrases[i];
		}
		req.session.bingoPhrases = phrases;
		req.session.bingoNextId = stockPhrases.length;
	};

	return {
		/**
		 * Return all the phrases set by the user
		 * Return array of objects with id and phrase properties
		 */
		getAllPhrases: function(req, res) {
			if(!req.session.bingoPhrases) {
				resetUserSession(req);
			}
			const phrases = [];
			for(let id in req.session.bingoPhrases) {
				if(req.session.bingoPhrases[id] !== null) {
					phrases.push({ "id": id, "phrase": req.session.bingoPhrases[id] });
				}
			}
			return res.json(phrases).end();
		},
		/**
		 * Factory reset to just stock phrases
		 * Return { status: ok } (JSON) on success
		 */
		deleteAllPhrases: function(req, res) {
			resetUserSession(req);
			return res.json({ "status": "ok" });
		},
		/**
		 * Remove the given phrase from the user's view of phrases
		 */
		deletePhrase: function(req, res) {
			if(!req.params.phraseId) {
				return res.status(400).json({"message": "phraseId is required"}).end();
			}
			console.log("Deleting phrase with ID " + req.params.phraseId + "...");
			const id = Number(req.params.phraseId);
			req.session.bingoPhrases[id] = null;
			res.json({"status": "ok"}).end();
		},
		/**
		 * Create a new phrase and save it in the session
		 */
		postPhrase: function(req, res) {
			if(!req.session.bingoPhrases) {
				resetUserSession(req);
			}
			if(!req.body.phrase) {
				return res.status(400).json({
					"status": "error",
					"message": "phrase is a required parameter"
				}).end();
			}
			console.log("Creating new phrase '" + req.body.phrase + "'...");
			const nextId = req.session.bingoNextId;
			req.session.bingoPhrases[nextId] = req.body.phrase;
			req.session.bingoNextId += 1;
			console.log("Created.");
			return res.json({"status": "ok"}).end();
		}
	};
};

module.exports = MeetingBingo();

