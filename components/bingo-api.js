// @flow

import "whatwg-fetch";

const BingoApi = {};
BingoApi.baseUrl = "/api";

const postJSON = (url: string, data: any) => {
	return fetch(url, {
		body: JSON.stringify(data),
		method: "POST",
		headers: { "Content-Type": "application/json" },
		// make sure to forward session
		credentials: "same-origin",
	});
};

const getJSON = (url: string) => {
	return fetch(url, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		// make sure to forward session
		credentials: "same-origin",
	});
};

const deleteJSON = (url: string) => {
	return fetch(url, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		// make sure to forward session
		credentials: "same-origin",
	});
};


BingoApi.postPhrase = function(phrase: string) {
	const url = BingoApi.baseUrl + "/phrase";
	const data = {
		"phrase": phrase
	};
	return postJSON(url, data).then((response) => {
		if(response.ok) {
			return response.json();
		} else {
			console.error("Failed to post phrase");
			console.error(response.text());
		}
	});
};

BingoApi.getPhrases = () => {
	const url = BingoApi.baseUrl + "/phrase/all";
	return getJSON(url)
		.then((response) => {
			console.log(response);
			return response.json();
		});
};

BingoApi.deleteAllPhrases = () => {
	const url = BingoApi.baseUrl + "/phrase/all";
	return deleteJSON(url)
		.then((response) => {
			return response.json();
		});
};

BingoApi.deletePhrase = (phraseId: number) => {
	const url = BingoApi.baseUrl + "/phrase/" + phraseId;
	return deleteJSON(url)
		.then((response) => {
			return response.json();
		});
};

module.exports = BingoApi;
