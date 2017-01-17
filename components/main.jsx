import React from "react";
import ReactDOM from "react-dom";

import BingoApi from "./bingo-api.js";
import BingoCard from "./card.jsx";
import Phrases from "./phrases.jsx";

export default class MeetingBingo extends React.Component {
    constructor() {
        super();
        this.state = {
			phrases: [],
			showBingoCard: false
        };
        this.getPhrases = this.getPhrases.bind(this);
        this.postPhrase = this.postPhrase.bind(this);
        this.deleteAllPhrases = this.deleteAllPhrases.bind(this);
        this.deletePhrase = this.deletePhrase.bind(this);
		this.showBingoCard = this.showBingoCard.bind(this);
    }

    getPhrases() {
        var that = this;
        BingoApi.getPhrases().then(function(phrases) {
            console.log("loaded phrases:");
            console.log(phrases);
            that.setState({ "phrases": phrases });
        });
    }

	deletePhrase(phraseId) {
        var that = this;
        BingoApi.deletePhrase(phraseId).then(function() {
            that.getPhrases();
        });
	}

    deleteAllPhrases() {
        var that = this;
        BingoApi.deleteAllPhrases().then(function() {
            that.getPhrases();
        });
    }

    postPhrase(phrase) {
        var that = this;
        console.log("submitting phrase = " + phrase);
        BingoApi.postPhrase(phrase).then(function() {
            console.log("Post phrase succeeded");
            that.getPhrases();
        });
    }

	showBingoCard(show) {
		this.setState({
			"renderBingoCard": show
		});
	}

    render() {
        //var grid = null;
        //if(this.state.phrases.length >= 24) {
            //grid = <BingoCard phrases={ this.state.phrases } />;
        //} else {
            //grid = null;
        //}
		if(this.state.renderBingoCard) {
			return <BingoCard phrases={ this.state.phrases } onBack={ () => this.showBingoCard(false) } />;
		} else {
			return (<div id="main-wrapper">
				<h1 className="header">Meeting Bingo</h1>
				<div id="instructions">
					<h2>Instructions</h2>
					<p>Have you ever seen a long and pointless meeting bearing down on you from a distance? Like a tidal wave seen from a small boat in the ocean, you know of the terrible fate about to befall you, yet you are powerless to stop it. But what if you could prepare for just such a calamity? I introduce to you the solution: meeting bingo!</p>
					<p>Before your meeting, think of phrases to put on a bingo card (generated here) which are likely to be said. I personally like phrases in the "pointless buzzword" category, but you don't have to restrain yourself. Next, print the card, or copy it into a notebook. Carry the notebook into the meeting, and impress your colleagues as you listen attentively, and periodically take notes. In fact, you cross off phrases as they are said, and quitly celebrate if you're able to get a Bingo!</p>
					<p>Included below are some sample phrases to get you started.</p>
				</div>
				<button role="button" className="btn btn-success" id="show-bingo-card-btn" type="button"
					onClick={ () => this.showBingoCard(true) }>Show Bingo Card</button>
				<Phrases post={ this.postPhrase }
					delete={ this.deletePhrase }
					getAll={ this.getPhrases }
					deleteAll={ this.deleteAllPhrases }
					phrases={ this.state.phrases } />
			</div>);
		}
    }
}

ReactDOM.render(
    <MeetingBingo />,
    document.getElementById("main-container")
);
