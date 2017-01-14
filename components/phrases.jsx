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
        return (<form id="phrase-form" role="form" onSubmit={ this.handleSubmit }>
            <input className="form-control" type="text" placeholder="your new phrase" value={ this.state.newPhrase }
                onChange={ this.handleChange } />
			<button className="btn btn-primary form-control" type="button"
				onClick={ this.handleSubmit }>Submit</button>
        </form>);
    }
}

class Phrase extends React.Component {
    constructor() {
        super();
        this.confirmDelete = this.confirmDelete.bind(this);
    }

	confirmDelete(event, phraseId) {
		event.preventDefault();
		var userIn = confirm("Are you sure you want to delete phrase '" + this.props.phrase.phrase + "'?");
		if(userIn) {
			this.props.delete(phraseId);
		}
	}

	render() {
		return (<li className="phrase" key={ this.props.phrase._id }>
			<span>{ this.props.phrase.phrase }</span>
			<span className="glyphicon glyphicon-remove remove-phrase-btn" role="btn"
				onClick={ (event) => { this.confirmDelete(event, this.props.phrase._id); } }></span>
		</li>);
	}
}

export default class Phrases extends React.Component {
    constructor() {
        super();
        this.confirmDeleteAll = this.confirmDeleteAll.bind(this);
    }

    componentWillMount() {
        console.log("loading phrases in componentWillMount...");
        this.props.getAll();
    }

    confirmDeleteAll(event) {
        event.preventDefault();
        var userIn = confirm("Are you sure you want to delete all phrases?");
        if(userIn) {
            this.props.deleteAll();
        }
    }

    render() {
        var items = [];
        for(var i = 0; i < this.props.phrases.length; i++) {
			items.push(<Phrase key={ this.props.phrases[i]._id } delete={ this.props.delete } phrase={ this.props.phrases[i] } />);
        }
        return (<div id="phrases-wrapper">
            <PhraseInput onSubmit={ this.props.post } />
            <h2>Extant Phrases</h2>
            <ol id="phrases-container">{ items }</ol>
			<button className="btn btn-danger" type="button"
				onClick={ this.confirmDeleteAll }>Delete Everything</button>
        </div>);
    }
}
