import React from "react";

interface IPhraseInputProps {
	errorMsg: string | null;
	handleAddPhrase: any;
}

interface IPhraseInputState {
	newPhrase: string;
}

export class PhraseInput extends React.PureComponent<IPhraseInputProps, IPhraseInputState> {
	constructor(props: IPhraseInputProps) {
		super(props);
		this.state = {
			newPhrase: ""
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event: React.SyntheticEvent) {
		if(event.target instanceof window.HTMLInputElement) {
			this.setState({ "newPhrase": event.target.value });
		}
	}

	handleSubmit(event: React.SyntheticEvent) {
		event.preventDefault();
		this.props.handleAddPhrase(this.state.newPhrase);

		console.log("resetting phrase");
		this.setState({
			newPhrase: ""
		});
	}

	render(): JSX.Element {
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

interface IPhraseProps {
	index: number;
	phrase: any;
	handleDelete: any;
}

export class Phrase extends React.PureComponent<IPhraseProps, {}> {
	constructor(props: IPhraseProps) {
		super(props);

		this.confirmDelete = this.confirmDelete.bind(this);
	}

	confirmDelete(event: React.SyntheticEvent) {
		event.preventDefault();
		const userIn = confirm(`Are you sure you want to delete phrase '${this.props.phrase.phrase}'?`);
		if(userIn) {
			this.props.handleDelete(this.props.index);
		}
	}

	render(): JSX.Element {
		return (<li className="phrase" key={ this.props.phrase.id }>
			<span className="phrase-text">{ this.props.phrase.phrase }</span>
			<span className="remove-phrase-btn" role="btn"
				onClick={ (event) => { this.confirmDelete(event); } }>&times;</span>
		</li>);
	}
}

interface IPhrasesProps {
	phrases: any[];
	isStockPhrases: boolean;
	errorMsg: string | null;

	handleShowBingoCard: any;
	handleDeletePhrase: any;
	handleAddPhrase: any;
	handleResetPhrases: any;
}

export const Phrases : React.FC<IPhrasesProps> = ({phrases, isStockPhrases, errorMsg,
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

export default Phrases;