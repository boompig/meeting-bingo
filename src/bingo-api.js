import "whatwg-fetch";
//import { IPhrase } from "./phrase.js";

const BingoApi = {};

const getJSON = (url) => {
	return fetch(url, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		// make sure to forward session
		credentials: "same-origin",
	});
};

BingoApi.getPhrases = function() {
	const url = "./data/stock-phrases.json";
	return getJSON(url)
		.then((response) => {
			console.log(response);
			return response.json();
		})
		.then((data) => {
			console.log(data);
			return data.phrases.map((phrase, i) => {
				return {
					"id": i + 1,
					"phrase": phrase
				};
			});
		});
};

export default BingoApi;
