// actions
export const SHOW_PHRASES = "SHOW_PHRASES";
export const SHOW_BINGO_CARD = "SHOW_BINGO_CARD";
export const RESET_PHRASES  = "RESET_PHRASES";
export const ADD_PHRASE  = "ADD_PHRASE";
export const DELETE_PHRASE = "DELETE_PHRASE";

// action creators
export function addPhrase(phrase) {
	return {
		type: ADD_PHRASE,
		phrase
	};
}

export function resetPhrases(phrases) {
	return {
		type: RESET_PHRASES,
		phrases
	};
}

export function deletePhrase(index) {
	return {
		type: DELETE_PHRASE,
		index
	};
}
