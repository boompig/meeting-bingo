import "whatwg-fetch";

const getJSON = async (url: string): Promise<Response> => {
	return fetch(url, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
		// make sure to forward session
		credentials: "same-origin",
	});
};

interface IPhraseWithSpeaker {
	phrase: string;
	speaker: string;
}

interface IDataWithSpeaker {
	phrases: IPhraseWithSpeaker[];
	hasSpeakers: true;
}

interface IDataNoSpeaker {
	phrases: string[];
	hasSpeakers: false;
}

type TData = IDataWithSpeaker | IDataNoSpeaker;

export interface IPhrase {
	id: number;
	phrase: string;
	speaker?: string;
}

export const BingoApi = {
	getPhrases: async function(phraseFile?: string | null): Promise<IPhrase[]> {
		let url = "./data/stock-phrases.json";
		if(phraseFile && phraseFile === "debate2020") {
			url = "./data/debate-phrases.json";
		} else if(phraseFile && phraseFile.endsWith(".json")) {
			url = `./data/${phraseFile}`;
		}
		console.log(`Fetching phrases using phrase file ${phraseFile}`);
		const response = await getJSON(url);
		console.log(response);
		if(response.ok) {
			const data : TData = await response.json();
			console.log(data);
			if (data.hasSpeakers) {
				return data.phrases.map((phrase: IPhraseWithSpeaker, i: number) => {
					return {
						"id": i + 1,
						"phrase": phrase.phrase,
						"speaker": phrase.speaker
					};
				});
			} else {
				return data.phrases.map((phrase: string, i: number) => {
					return {
						"id": i + 1,
						"phrase": phrase
					};
				});
			}
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
		u.pathname = window.location.pathname;
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