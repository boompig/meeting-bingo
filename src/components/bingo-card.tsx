import React from "react";
import shuffle from "lodash.shuffle";
import {IPhrase} from "../bingo-api";

const COLS = ["B", "I", "N", "G", "O"];

interface IBingoGridProps {
	phrases: any[];
	clickedCells: any;
	bingoCells: any[];

	handleCellClicked: any;
}

/**
 * This component should not receive all phrases, only 24 of them
 */
export class BingoGrid extends React.PureComponent<IBingoGridProps, {}> {
	constructor(props: IBingoGridProps) {
		super(props);

	}

	render() {
		const rows = [];

		for(let row = 0; row < 5; row++) {
			let cells = [];
			for(let col = 0; col < 5; col++) {
				let idx = col * 5 + row;
				let key = COLS[col] + (row + 1);
				let contents;
				let speaker = null;
				if(idx === 12) {
					contents = "Free";
				} else if(idx > 12) {
					contents = this.props.phrases[idx - 1].phrase;
					speaker = this.props.phrases[idx - 1].speaker;
				} else {
					contents = this.props.phrases[idx].phrase;
					speaker = this.props.phrases[idx].speaker;
				}

				let classes = "bingo-tile";
				if(this.props.bingoCells.indexOf(key) !== -1) {
					classes += " bingo-cell";
				} else if(key in this.props.clickedCells) {
					classes += " cell-clicked";
				}
				let speakerClasses = "cell-speaker";
				if(speaker) {
					// NOTE: have to be careful here about where the speaker comes from
					const safeSpeaker = speaker.toLowerCase().replace("'", "");
					speakerClasses += ` cell-speaker-${safeSpeaker}`;
				}

				cells.push(<td key={key} data-key={key} className={classes}
					onClick={() => this.props.handleCellClicked(key)}>
					<div className="cell-contents">{ contents }</div>
					{speaker ?
						<div className={speakerClasses}>{ speaker }</div> : null}
				</td>);
			}
			rows.push(<tr key={row}>{ cells }</tr>);
		}
		return (<table id="bingo-tile-container">
			<thead>
				<tr>
					<th>B</th>
					<th>I</th>
					<th>N</th>
					<th>G</th>
					<th>O</th>
				</tr>
			</thead>
			<tbody>{ rows }</tbody>
		</table>);
	}
}


/**
 * Not the most efficient algorithm but it gets the job done
 */
function randomSubset(arr: IPhrase[], size: number): IPhrase[] {
	let shuffled = shuffle(arr.slice(0));
	return shuffled.slice(0, size);
}

/**
 * @param {array} phrases
 * @param {number} genSeed
 * @returns {string}
 */
function computeArrayHash(phrases: any[], genSeed: number): string {
	let l = phrases.map((p) => p.phrase);
	return l.join(",") + genSeed;
}

/**
 * @param {string} row 1-indexed row as string
 * @returns {string[]}
 */
function getRowCells(row: string): string[] {
	return COLS.map((col) => col + row);
}

/**
 * @returns {string[]}
 */
function getMajorDiagonalCells(): string[] {
	return COLS.map((row, i) => {
		return row + (i + 1);
	});
}

function getMinorDiagonalCells(): string[] {
	return COLS.map((row, i) => {
		return row + (5 - i);
	});
}

/**
 * @param {string} col name of column
 * @returns {string[]}
 */
function getColumnCells(col: string): string[] {
	return [1, 2, 3, 4, 5].map((row) => col + row);
}

/**
 * @param {string[]} bingoCells list of cells to check
 * @param {object} clickedCells maps clicked cell keys to bools
 * @param {string} key
 * @returns {boolean}
 */
function checkBingo(bingoCells: string[], clickedCells: any, key: string): boolean {
	for(let cell of bingoCells) {
		if(cell !== key && !(cell in clickedCells)) {
			return false;
		}
	}
	return true;
}

/**
 * @param {object} clickedCells maps clicked cell keys to bools
 * @param {string} key
 * @returns {boolean}
 */
function checkRowBingo(clickedCells: any, key: string): boolean {
	const row = key[1];
	const bingoCells = getRowCells(row);
	return checkBingo(bingoCells, clickedCells, key);
}

/**
 * @param {object} clickedCells maps clicked cell keys to bools
 * @param {string} key
 * @returns {boolean}
 */
function checkColumnBingo(clickedCells: any, key: string): boolean {
	const col = key[0];
	const bingoCells = getColumnCells(col);
	return checkBingo(bingoCells, clickedCells, key);
}

/**
 * @param {object} clickedCells maps clicked cell keys to bools
 * @param {string} key
 * @returns {boolean}
 */
function checkMajorDiagonalBingo(clickedCells: any, key: string): boolean {
	const bingoCells = getMajorDiagonalCells();
	return checkBingo(bingoCells, clickedCells, key);
}

/**
 * @param {object} clickedCells maps clicked cell keys to bools
 * @param {string} key
 * @returns {boolean}
 */
function checkMinorDiagonalBingo(clickedCells: any, key: string): boolean {
	const bingoCells = getMinorDiagonalCells();
	return checkBingo(bingoCells, clickedCells, key);
}

interface IBingoCardProps {
	phrases: IPhrase[];
	/**
	 * Whether to split the speaker name and phrase
	 */
	contest: string | null;
	onBack(): void;
}

interface IBingoCardState {
	subset: any[];

	clickedCells: {[key: string]: boolean};
	bingoCells: string[];
	isBingo: boolean;
	subsetHash: string;
	genSeed: number;

	showGif: boolean;
}

export default class BingoCard extends React.PureComponent<IBingoCardProps, IBingoCardState> {

	constructor(props: IBingoCardProps) {
		super(props);

		this.state = {
			subset: [],
			clickedCells: {
				// free cell always in clicked cells
				"N3": true
			},

			// derived state
			bingoCells: [],

			// UI thing
			isBingo: false,

			// mechanism to avoid regeneration of bingo card on each click
			subsetHash: "",
			genSeed: 1,

			showGif: false,
		};

		this.resetClicked = this.resetClicked.bind(this);
		this.onCellClicked = this.onCellClicked.bind(this);
		this.onGenClick = this.onGenClick.bind(this);
		this.onHideGif = this.onHideGif.bind(this);
		this.onShowGif = this.onShowGif.bind(this);
	}

	onShowGif() {
		this.setState({
			showGif: true
		});
	}

	onHideGif() {
		this.setState({
			showGif: false
		});
	}

	/**
	 * @param {string} key 2 chars: name of column + 1-indexed row
	 */
	onCellClicked(key: string) {
		if(!(key in this.state.clickedCells)) {
			let showGif = this.state.showGif;

			// console.log("clicked cell " + key + " for the first time");
			// add to clicked cells
			const newItem : any= {};
			newItem[key] = true;
			const clickedCells = Object.assign({}, this.state.clickedCells, newItem);
			let bingoCells: string[] = [];
			let isBingo = false;

			// check whether we're at GAME OVER
			// just check current row and column
			if(checkRowBingo(clickedCells, key)) {
				isBingo = true;
				bingoCells = [...bingoCells, ...getRowCells(key[1])];
			}
			// deliberately not elseif
			if(checkColumnBingo(clickedCells, key)) {
				isBingo = true;
				bingoCells = [...bingoCells, ...getColumnCells(key[0])];
			}
			// deliberately not elseif
			if(checkMajorDiagonalBingo(clickedCells, key)) {
				isBingo = true;
				bingoCells = [...bingoCells, ...getMajorDiagonalCells()];
			}
			// deliberately not elseif
			if(checkMinorDiagonalBingo(clickedCells, key)) {
				isBingo = true;
				bingoCells = [...bingoCells, ...getMinorDiagonalCells()];
			}

			if(isBingo && !this.state.isBingo) {
				showGif = true;
			}

			this.setState({
				clickedCells: clickedCells,
				bingoCells: bingoCells,
				isBingo: isBingo,
				showGif: showGif,
			});
		}
	}

	resetClicked() {
		this.setState({
			clickedCells: {"N3": true},
			bingoCells: [],
			isBingo: false
		});
	}

	static getDerivedStateFromProps(props: IBingoCardProps, state: IBingoCardState) {
		// keep calm and carry on
		let hash = computeArrayHash(props.phrases, state.genSeed);
		if(hash !== state.subsetHash) {
			const phrasesSubset = randomSubset(props.phrases, 24);
			return {
				subset: phrasesSubset,
				subsetHash: hash
			};
		} else {
			return {};
		}
	}

	onGenClick(event: React.SyntheticEvent) {
		event.preventDefault();
		// step 1 -> genSeed += 1
		const genSeed = this.state.genSeed + 1;
		const phrasesSubset = randomSubset(this.props.phrases, 24);
		let hash = computeArrayHash(this.props.phrases, genSeed);

		this.setState({
			subset: phrasesSubset,
			genSeed: genSeed,
			subsetHash: hash,
			clickedCells: {"N3": true},
			bingoCells: [],
			isBingo: false,
			showGif: false,
		});
	}

	render(): JSX.Element {
		return (<div id="grid-wrapper">
			<button className="btn btn-success" type="button" id="back-to-phrases-btn"
				onClick={ this.props.onBack }>Back to phrases</button>
			{ (this.state.isBingo && this.state.showGif) ?
				<img src="img/bingo.gif" /> :
				<BingoGrid phrases={this.state.subset}
					clickedCells={this.state.clickedCells}
					bingoCells={this.state.bingoCells}
					handleCellClicked={this.onCellClicked} />
			}

			<div className="btn-container">
				{this.state.isBingo && this.state.showGif ?
					<button className="btn btn-outline-success" type="button"
						onClick={this.onHideGif}>Show Completed Bingo Card</button> : null}
				{this.state.isBingo && !this.state.showGif ?
					<button className="btn btn-outline-success" type="button"
						onClick={this.onShowGif}>Show Animation</button> : null }

				{this.state.isBingo ? null :
					<button className="btn btn-warning reset-clicked-cells-btn" type="button"
						onClick={this.resetClicked}>Reset Clicked Cells</button>}
				<button className="btn btn-primary gen-grid-btn" type="button"
					onClick={ this.onGenClick }>Generate New Grid</button>
			</div>
		</div>);
	}
}
