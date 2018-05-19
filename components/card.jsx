// @flow

import React from "react";
import shuffle from "lodash.shuffle";
import { IPhrase } from "./phrase.js";

interface IBingoGridProps {
	phrases: Array<IPhrase>;
}

interface IBingoGridState {
}

/**
 * This component should not receive all phrases, only 24 of them
 */
export class BingoGrid extends React.Component<IBingoGridProps, IBingoGridState> {
	render() {
		const rows = [];
		// instead of dealing with index complications just insert the Free tile in the middle
		this.props.phrases.splice(12, 0, { "phrase": "Free", "id": -1 });
		for(let i = 0; i < 5; i++) {
			let cells = [];
			for(let j = 0; j < 5; j++) {
				let contents = this.props.phrases[i * 5 + j].phrase;
				cells.push(<td key={i * 5 + j} className="bingo-tile">
					<span>{ contents }</span>
				</td>);
			}
			rows.push(<tr key={i}>{ cells }</tr>);
		}
		return <table id="bingo-tile-container"><tbody>{ rows }</tbody></table>;
	}
}

interface IBingoCardProps {
	phrases: Array<IPhrase>;
	onBack: Function;
}

interface IBingoCardState {
	subset: Array<IPhrase>;
}

export default class BingoCard extends React.Component<IBingoCardProps, IBingoCardState> {
	onGenClick: Function;

	constructor(props: IBingoCardProps) {
		super(props);
		this.state = {
			"subset": []
		};

		this.onGenClick = this.onGenClick.bind(this);
	}

	/**
	 * Not the most efficient algorithm but it gets the job done
	 */
	randomSubset(arr: Array<IPhrase>, size: number) {
		let shuffled = shuffle(arr.slice(0));
		return shuffled.slice(0, size);
	}

	componentWillMount() {
		let phrasesSubset = this.randomSubset(this.props.phrases, 24);
		this.setState({
			"subset": phrasesSubset
		});
	}

	/**
	 * When phrases change
	 */
	componentWillReceiveProps(nextProps: IBingoCardProps) {
		const phrasesSubset = this.randomSubset(nextProps.phrases, 24);
		this.setState({
			"subset": phrasesSubset
		});
	}

	onGenClick(event: window.SyntheticEvent<HTMLElement>) {
		event.preventDefault();
		const phrasesSubset = this.randomSubset(this.props.phrases, 24);
		this.setState({
			"subset": phrasesSubset
		});
	}

	render() {
		return (<div id="grid-wrapper">
			<button className="btn btn-success" type="button" id="back-to-phrases-btn"
				onClick={ this.props.onBack }>Back to phrases</button>
			<button className="btn btn-primary" type="button"
				onClick={ this.onGenClick }>Generate New Grid</button>
			<BingoGrid phrases={ this.state.subset } />
		</div>);
	}
}
