import React from "react";

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
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    componentWillMount() {
        console.log("loading phrases in componentWillMount...");
        this.props.getAll();
    }

    confirmDelete(event) {
        event.preventDefault();
        var userIn = confirm("Are you sure you want to delete all phrases?");
        if(userIn) {
            this.props.deleteAll();
        }
    }

    render() {
        var items = [];
        for(var i = 0; i < this.props.phrases.length; i++) {
            items.push(<li className="phrase" key={i}>{ this.props.phrases[i] }</li>);
        }
        return (<div>
            <PhraseInput onSubmit={ this.props.post } />
            <h2>Extant Phrases</h2>
            <ol id="phrases-container">{ items }</ol>
            <button type="button" onClick={ this.confirmDelete }>Delete Everything</button>
        </div>);
    }
}
