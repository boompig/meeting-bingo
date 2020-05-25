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

interface IData {
	phrases: string[];
}

const BingoApi = {
	getPhrases: async function() {
		const url = "./data/stock-phrases.json";
		const response = await getJSON(url);
		console.log(response);
		if(response.ok) {
			const data : IData = await response.json();
			console.log(data);
			return data.phrases.map((phrase: string, i: number) => {
				return {
					"id": i + 1,
					"phrase": phrase
				};
			});
		} else {
			throw new Error('failed to fetch stock phrases')
		}
	}
};

export default BingoApi;