import "whatwg-fetch";

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

export interface IPhrase {
	id: number;
	phrase: string;
}

export const BingoApi = {
	getPhrases: async function(): Promise<IPhrase[]> {
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
			throw new Error("failed to fetch stock phrases");
		}
	},

	sharePhrases: function(phrases: IPhrase[]): string {
		console.log("share button pressed");
		console.log(phrases);

		// step 1 - sort the phrases
		const l = phrases.map(p => p.phrase);
		l.sort();
		// step 2 - encode the phrases
		const s = btoa(JSON.stringify(l));
		const u = new URL(window.location.origin);
		u.searchParams.set("phrases", s);
		return u.toString();
	},

	decodePhrases: function(phrasesParam: string): IPhrase[] {
		const s = atob(phrasesParam);
		const l = JSON.parse(s);
		return l.map((phrase: string, i: number) => {
			return {
				"id": i + 1,
				"phrase": phrase,
			};
		});
	}
};

export default BingoApi;