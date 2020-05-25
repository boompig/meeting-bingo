import { Action, IAction } from "./actions";

interface IPhrase {
	phrase: string;
	id: number;
}

export const viewReducer = function (state: undefined | any, action: IAction): any {
	if(typeof state === "undefined") {
		// initial state
		return {
			view: "/",
			phrases: [],
			nextId: 0,
			isStockPhrases: false,
		};
	}

	switch (action.type) {
		case Action.SHOW_PHRASES:
			return Object.assign({}, state, {
				view: "/phrases",
			});
		case Action.SHOW_BINGO_CARD:
			return Object.assign({}, state, {
				view: "/bingo-card",
			});

		case Action.ADD_PHRASE:
			// does the phrase exist?
			const phrases = state.phrases.map((p: IPhrase) => {
				return p.phrase;
			});
			if(phrases.indexOf(action.phrase) === -1) {
				const newP = {
					id: state.nextId,
					phrase: action.phrase
				};
				const newPhrases = [...state.phrases, newP];
				return Object.assign({}, state, {
					phrases: newPhrases,
					nextId: state.nextId + 1,
					isStockPhrases: false,
					phraseError: null
				});
			} else {
				return Object.assign({}, state, {
					phraseError: `${action.phrase} already present in phrases`
				});
			}
		case Action.RESET_PHRASES:
			const nextId = Math.max(...action.phrases.map((p: IPhrase) => {
				return p.id;
			})) + 1;
			// loaded phrases from backend
			return Object.assign({}, state, {
				phrases: action.phrases,
				nextId: nextId,
				isStockPhrases: true,
				phraseError: null
			});
		case Action.DELETE_PHRASE: {
			if(typeof action.index !== 'number') {
				throw new Error(`Error: action.index not set to a number`);
			}
			const phrases = [...state.phrases.slice(0, action.index), ...state.phrases.slice(action.index + 1)];
			return Object.assign({}, state, {
				phrases: phrases,
				isStockPhrases: false,
				phraseError: null
			});
		}
		default:
			console.error(action);
			return state;
	}
};
