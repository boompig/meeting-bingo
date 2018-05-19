// @flow

import React from "react";
import { IPhrase } from "./phrase.js";

interface IPhraseInputState {
	newPhrase: string;
}

interface IPhraseInputProps {
	onSubmit: Function;
}

export class PhraseInput extends React.Component<IPhraseInputProps, IPhraseInputState> {
	handleSubmit: Function;
	handleChange: Function;

	constructor(props: IPhraseInputProps) {
		super(props);
		this.state = {
			"newPhrase": ""
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event: window.SyntheticEvent<HTMLElement>) {
		if(event.target instanceof window.HTMLInputElement) {
			this.setState({ "newPhrase": event.target.value });
		}
	}

	handleSubmit(event: window.SyntheticEvent<HTMLElement>) {
		event.preventDefault();
		this.props.onSubmit(this.state.newPhrase);
		console.log("resetting phrase");
		this.setState({ "newPhrase": "" });
	}

	render() {
		return (<form id="phrase-form" role="form" onSubmit={ this.handleSubmit }>
			<input
				className="form-control"
				type="text"
				placeholder="your new phrase"
				value={ this.state.newPhrase }
				onChange={ this.handleChange } />
			<button
				className="btn btn-primary form-control"
				type="button"
				onClick={ this.handleSubmit }>Submit</button>
		</form>);
	}
}

interface IPhraseProps {
	delete: Function;
	phrase: IPhrase;
}

export class Phrase extends React.Component<IPhraseProps, {}> {
	confirmDelete: Function;

	constructor(props: IPhraseProps) {
		super(props);

		this.confirmDelete = this.confirmDelete.bind(this);
	}

	confirmDelete(event: window.SyntheticEvent, phraseId: number) {
		event.preventDefault();
		const userIn = confirm("Are you sure you want to delete phrase '" + this.props.phrase.phrase + "'?");
		if(userIn) {
			this.props.delete(phraseId);
		}
	}

	render() {
		return (<li className="phrase" key={ this.props.phrase.id }>
			<span>{ this.props.phrase.phrase }</span>
			<span className="glyphicon glyphicon-remove remove-phrase-btn" role="btn"
				onClick={ (event) => { this.confirmDelete(event, this.props.phrase.id); } }></span>
		</li>);
	}
}

interface IPhrasesProps {
	getAll: Function;
	post: Function;
	deleteAll: Function;
	phrases: Array<IPhrase>;
	delete: Function;
}

export default class Phrases extends React.Component<IPhrasesProps, {}> {
	confirmDeleteAll: Function;

	constructor(props: IPhrasesProps) {
		super(props);

		this.confirmDeleteAll = this.confirmDeleteAll.bind(this);
	}

	componentWillMount() {
		console.log("[Phrases.componentWillMount] loading phrases...");
		this.props.getAll();
	}

	confirmDeleteAll(event: window.SyntheticEvent<HTMLElement>) {
		event.preventDefault();
		const userIn = confirm("Are you sure you want to delete all the phrases you added and restore the default phrases?");
		if(userIn) {
			this.props.deleteAll();
		}
	}

	render() {
		const items = [];
		for(let i = 0; i < this.props.phrases.length; i++) {
			items.push(<Phrase key={ this.props.phrases[i].id } delete={ this.props.delete } phrase={ this.props.phrases[i] } />);
		}
		return (<div id="phrases-wrapper">
			<PhraseInput onSubmit={ this.props.post } />
			<h2>Phrases</h2>
			<ol id="phrases-container">{ items }</ol>
			<button className="btn btn-danger delete-phrase-btn" type="button"
				onClick={ this.confirmDeleteAll }>Factory Reset</button>
		</div>);
	}
}
