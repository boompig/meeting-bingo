import {SHOW_PHRASES, SHOW_BINGO_CARD, RESET_PHRASES, ADD_PHRASE, DELETE_PHRASE } from "./actions";


export const viewReducer = function (state, action) {
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
		case SHOW_PHRASES:
			return Object.assign({}, state, {
				view: "/phrases",
			});
		case SHOW_BINGO_CARD:
			return Object.assign({}, state, {
				view: "/bingo-card",
			});

		case ADD_PHRASE:
			const newP = {
				id: state.nextId,
				phrase: action.phrase
			};
			const phrases = [...state.phrases, newP];
			return Object.assign({}, state, {
				phrases: phrases,
				nextId: state.nextId + 1,
				isStockPhrases: true
			});
		case RESET_PHRASES:
			const nextId = Math.max(...action.phrases.map(p => p.id)) + 1;
			// loaded phrases from backend
			return Object.assign({}, state, {
				phrases: action.phrases,
				nextId: nextId,
				isStockPhrases: true
			});
		case DELETE_PHRASE: {
			const phrases = [...state.phrases.slice(0, action.index), ...state.phrases.slice(action.index + 1)];
			return Object.assign({}, state, {
				phrases: phrases,
				isStockPhrases: false
			});
		}
		default:
			console.error(action);
			return state;
	}
};
