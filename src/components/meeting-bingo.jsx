import React from "react";
import PropTypes from "prop-types";

import BingoCard from "./card.jsx";
import Phrases from "./phrases.jsx";
// import { IPhrase } from "./phrase.js";

// type View = "/bingo-card" | "/" | "/phrases";


const MeetingBingo = ({view, phrases, isStockPhrases,
	handleShowPhrases, handleDeletePhrase, handleAddPhrase, handleResetPhrases, handleShowBingoCard }) => {
	if(view === "/bingo-card") {
		return <BingoCard
			phrases={ phrases }
			onBack={handleShowPhrases} />;
	} else if(view === "/") {
		return (<div id="main-wrapper">
			<h1 className="header">Meeting Bingo</h1>
			<div className="instructions">
				<h2>Instructions</h2>
				<p>Have you ever seen a long and pointless meeting bearing down on you from a distance? Like a tidal wave seen from a small boat in the ocean, you know of the terrible fate about to befall you, yet you are powerless to stop it. But what if you could prepare for just such a calamity? I introduce to you the solution: meeting bingo!</p>
				<p>Before your meeting, think of phrases to put on a bingo card (generated here) which are likely to be said. I personally like phrases in the &quot;pointless buzzword&quot; category, but you don&apos;t have to restrain yourself. Next, print the card, or copy it into a notebook. Carry the notebook into the meeting, and impress your colleagues as you listen attentively, and periodically take notes. In fact, you cross off phrases as they are said, and quietly celebrate if you&apos;re able to get a Bingo!</p>
				{/* <p>Included below are some sample phrases to get you started.</p> */}
			</div>
			<button className="btn btn-primary btn-lg get-started-btn" onClick={ handleShowPhrases }>Get Started</button>
		</div>);
	} else {
		return (<div id="main-wrapper" className="container">
			<Phrases phrases={phrases}
				isStockPhrases={isStockPhrases}

				handleDeletePhrase={handleDeletePhrase}
				handleAddPhrase={handleAddPhrase}
				handleShowBingoCard={handleShowBingoCard}
				handleResetPhrases={handleResetPhrases} />
		</div>);
	}
};

MeetingBingo.propTypes = {
	view: PropTypes.string.isRequired,
	phrases: PropTypes.array.isRequired,
	isStockPhrases: PropTypes.bool.isRequired,

	handleAddPhrase: PropTypes.func.isRequired,
	handleDeletePhrase: PropTypes.func.isRequired,
	handleShowPhrases: PropTypes.func.isRequired,
	handleShowBingoCard: PropTypes.func.isRequired,
	handleResetPhrases: PropTypes.func.isRequired
};

export default MeetingBingo;