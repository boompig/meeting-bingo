import React from "react";
import BingoApi from "./bingo-api.js";

class PhraseInput extends React.Component {
    constructor() {
        super();
        this.state = { "newPhrase": "" };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({"newPhrase": event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.state.newPhrase);
        console.log("resetting phrase");
        this.setState({ "newPhrase": "" });
    }

    render() {
        return (<form onSubmit={ this.handleSubmit }>
            <input type="text" placeholder="your new phrase" value={ this.state.newPhrase }
                onChange={ this.handleChange } />
            <button type="button" onClick={ this.handleSubmit }>Submit</button>
        </form>);
    }
}

export default class Phrases extends React.Component {
    constructor() {
        super();
        this.state = {
            phrases: []
        };
        this.onSubmitPhrase = this.onSubmitPhrase.bind(this);
        this.loadPhrases = this.loadPhrases.bind(this);
        this.deletePhrases = this.deletePhrases.bind(this);
    }

    componentWillMount() {
        console.log("loading phrases in componentWillMount...");
        this.loadPhrases();
    }

    loadPhrases() {
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
            that.loadPhrases();
        });
    }

    onSubmitPhrase(phrase) {
        var that = this;
        console.log("submitting phrase = " + phrase);
        BingoApi.postPhrase(phrase).then(function() {
            console.log("Post phrase succeeded");
            that.loadPhrases();
        });
    }

    render() {
        var items = [];
        for(var i = 0; i < this.state.phrases.length; i++) {
            items.push(<li className="phrase" key={i}>{ this.state.phrases[i] }</li>);
        }
        return (<div>
            <PhraseInput onSubmit={ this.onSubmitPhrase } />
            <h2>Extant Phrases</h2>
            <ol id="phrases-container">{ items }</ol>
            <button type="button" onClick={ this.deletePhrases }>Delete Everything</button>
        </div>);
    }
}
