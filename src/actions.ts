// actions
import {IPhrase} from "./bingo-api";

export enum Action {
	SHOW_PHRASES = "SHOW_PHRASES",
	SHOW_BINGO_CARD = "SHOW_BINGO_CARD",
	RESET_PHRASES = "RESET_PHRASES",
	ADD_PHRASE = "ADD_PHRASE",
	DELETE_PHRASE = "DELETE_PHRASE",
	SHARE_PHRASES = "SHARE_PHRASES",
}

export interface IAction {
	type: Action,

	// addPhrase
	phrase?: string;

	// resetPhrase
	phrases?: IPhrase[];

	// deletePhrase
	index?: number;
}

// action creators
export function addPhrase(phrase: string) {
	return {
		type: Action.ADD_PHRASE,
		phrase
	};
}

export function resetPhrases(phrases: string[]) {
	return {
		type: Action.RESET_PHRASES,
		phrases
	};
}

export function deletePhrase(index: number) {
	return {
		type: Action.DELETE_PHRASE,
		index
	};
}

export function sharePhrases(phrases: IPhrase[]) {
	return {
		type: Action.SHARE_PHRASES,
		phrases
	};
}
