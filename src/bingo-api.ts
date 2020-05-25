import "whatwg-fetch";
//import { IPhrase } from "./phrase.js";

const getJSON = async (url: string): Promise<Response> => {
	return fetch(url, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		// make sure to forward session
		credentials: "same-origin",
	});
};

const BingoApi = {
	getPhrases: async function() {
		const url = "./data/stock-phrases.json";
		const response = await getJSON(url);
		console.log(response);
		const data = await response.json();
		console.log(data);
		return data.phrases.map((phrase: string, i: number) => {
			return {
				"id": i + 1,
				"phrase": phrase
			};
		});
	}
};

export default BingoApi;