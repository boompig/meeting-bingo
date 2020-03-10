import React from "react";
import PropTypes from "prop-types";


export class PhraseInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newPhrase: ""
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		if(event.target instanceof window.HTMLInputElement) {
			this.setState({ "newPhrase": event.target.value });
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		this.props.handleAddPhrase(this.state.newPhrase);

		console.log("resetting phrase");
		this.setState({
			newPhrase: ""
		});
	}

	render() {
		let errorElem = null;
		if(this.props.errorMsg) {
			errorElem = (<div className="alert alert-danger">
				<strong>Error!</strong>&nbsp;
				<span>{this.props.errorMsg}</span>
			</div>);
		}
		return (<form id="phrase-form" role="form" onSubmit={ this.handleSubmit }>
			{errorElem}
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

PhraseInput.propTypes = {
	errorMsg: PropTypes.string,
	handleAddPhrase: PropTypes.func.isRequired
};

export class Phrase extends React.Component {
	constructor(props) {
		super(props);

		this.confirmDelete = this.confirmDelete.bind(this);
	}

	confirmDelete(event) {
		event.preventDefault();
		const userIn = confirm(`Are you sure you want to delete phrase '${this.props.phrase.phrase}'?`);
		if(userIn) {
			this.props.handleDelete(this.props.index);
		}
	}

	render() {
		return (<li className="phrase" key={ this.props.phrase.id }>
			<span className="phrase-text">{ this.props.phrase.phrase }</span>
			<span className="glyphicon glyphicon-remove remove-phrase-btn" role="btn"
				onClick={ (event) => { this.confirmDelete(event); } }></span>
		</li>);
	}
}

Phrase.propTypes = {
	index: PropTypes.number.isRequired,
	phrase: PropTypes.object.isRequired,
	handleDelete: PropTypes.func.isRequired
};

export const Phrases = ({phrases, isStockPhrases, errorMsg,
	handleDeletePhrase, handleAddPhrase, handleResetPhrases, handleShowBingoCard}) => {

	const onReset = function() {
		const userIn = confirm("Remove all custom phrases?");
		if(userIn) {
			handleResetPhrases();
		}
	};

	const items = [];
	for(let i = 0; i < phrases.length; i++) {
		items.push(<Phrase
			key={ phrases[i].id }
			handleDelete={ handleDeletePhrase }
			phrase={ phrases[i] }
			index={i} />);
	}

	const createIsDisabled = phrases.length < 24;

	return (<div id="phrases-wrapper">
		<h1 className="title">Phrases</h1>
		<PhraseInput handleAddPhrase={ handleAddPhrase } errorMsg={errorMsg} />
		<ol id="phrases-container">{items}</ol>

		<button className="btn btn-success show-bingo-card-btn" type="button"
			onClick={handleShowBingoCard} disabled={createIsDisabled}>Create Bingo Card</button>
		<button className={"btn btn-danger reset-phrases-btn"} type="button"
			disabled={isStockPhrases}
			onClick={ onReset }>Reset Phrases</button>
	</div>);
};

Phrases.propTypes = {
	phrases: PropTypes.array.isRequired,
	isStockPhrases: PropTypes.bool.isRequired,
	errorMsg: PropTypes.string,

	handleShowBingoCard: PropTypes.func.isRequired,
	handleDeletePhrase: PropTypes.func.isRequired,
	handleAddPhrase: PropTypes.func.isRequired,
	handleResetPhrases: PropTypes.func.isRequired
};

export default Phrases;