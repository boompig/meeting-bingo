import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";

import MeetingBingo from "./components/meeting-bingo";
import {viewReducer} from "./reducers";
import BingoApi from "./bingo-api";
import {SHOW_PHRASES, SHOW_BINGO_CARD, resetPhrases, deletePhrase, addPhrase } from "./actions";


const mapStateToProps = state => {
	return state;
};

const mapDispatchToProps = dispatch => {
	return {
		handleShowPhrases: () => dispatch({type: SHOW_PHRASES}),
		handleShowCard: () => dispatch({type: SHOW_BINGO_CARD}),

		handleShowBingoCard: () => dispatch({type: SHOW_BINGO_CARD}),
		handleDeletePhrase: (index) => dispatch(deletePhrase(index)),
		handleAddPhrase: (phrase) => dispatch(addPhrase(phrase)),
		handleResetPhrases: () => {
			return BingoApi.getPhrases()
				.then((phrases) => {
					dispatch(resetPhrases(phrases));
				});
		}
	};
};

const store = createStore(viewReducer);
const Container = connect(mapStateToProps, mapDispatchToProps)(MeetingBingo);

BingoApi.getPhrases()
	.then((phrases) => {
		store.dispatch(resetPhrases(phrases));
	});

const App = () => {
	return (<Provider store={ store }>
		<Container />
	</Provider>);
};

ReactDOM.render(
	<App />,
	document.getElementById("react-root")
);
