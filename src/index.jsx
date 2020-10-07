import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";

import MeetingBingo from "./components/meeting-bingo";
import {viewReducer} from "./reducers";
import BingoApi from "./bingo-api";
import {Action, resetPhrases, deletePhrase, addPhrase, sharePhrases } from "./actions";


const mapStateToProps = state => {
	return state;
};

const mapDispatchToProps = dispatch => {
	return {
		handleShowPhrases: () => dispatch({type: Action.SHOW_PHRASES}),
		handleShowCard: () => dispatch({type: Action.SHOW_BINGO_CARD}),
		handleShare: (phrases) => dispatch(sharePhrases(phrases)),
		handleShowBingoCard: () => dispatch({type: Action.SHOW_BINGO_CARD}),
		handleDeletePhrase: (index) => dispatch(deletePhrase(index)),
		handleAddPhrase: (phrase) => dispatch(addPhrase(phrase)),
		handleResetPhrases: (phrases) => {
			if(phrases) {
				return dispatch(resetPhrases(phrases));
			} else {
				return BingoApi.getPhrases()
					.then((phrases) => {
						dispatch(resetPhrases(phrases));
					});
			}
		}
	};
};

const store = createStore(viewReducer);
const Container = connect(mapStateToProps, mapDispatchToProps)(MeetingBingo);

const u = new URL(window.location.href);
if(u.searchParams.get("phrases")) {
	console.log("received phrases from a share link");
	// decode the phrases
	const phrases = BingoApi.decodePhrases(u.searchParams.get("phrases"));
	// then set phrases accordingly
	store.dispatch(resetPhrases(phrases));
} else {
	let phraseFile = null;
	if(u.searchParams.get("phraseFile")) {
		phraseFile = u.searchParams.get("phraseFile");
	}
	// otherwise use the default
	BingoApi.getPhrases(phraseFile)
		.then((phrases) => {
			store.dispatch(resetPhrases(phrases));
		});
}

const App = () => {
	return (<Provider store={ store }>
		<Container />
	</Provider>);
};

ReactDOM.render(
	<App />,
	document.getElementById("react-root")
);
