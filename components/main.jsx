import React from "react";
import ReactDOM from "react-dom";

import BingoApi from "./bingo-api.js";
import BingoCard from "./card.jsx";
import Phrases from "./phrases.jsx";

export default class MeetingBingo extends React.Component {
    constructor() {
        super();
        this.state = {
            phrases: []
        };
        this.getPhrases = this.getPhrases.bind(this);
        this.postPhrase = this.postPhrase.bind(this);
        this.deletePhrases = this.deletePhrases.bind(this);
    }

    getPhrases() {
        var that = this;
        BingoApi.getPhrases().then(function(phrases) {
            console.log("loaded phrases:");
            console.log(phrases);
            that.setState({ "phrases": phrases });
        });
    }

    deletePhrases(event) {
        event.preventDefault();
        var that = this;
        BingoApi.deletePhrases().then(function() {
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

    render() {
        var grid = null;
        if(this.state.phrases.length >= 24) {
            grid = <BingoCard phrases={ this.state.phrases } />;
        } else {
            grid = null;
        }
        return (<div>
            { grid }
            <Phrases post={ this.postPhrase }
                getAll={ this.getPhrases }
                deleteAll={ this.deletePhrases }
                phrases={ this.state.phrases } />
        </div>);
    }
}

ReactDOM.render(
    <MeetingBingo />,
    document.getElementById("main-container")
);
