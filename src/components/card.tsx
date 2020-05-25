import React from "react";
import shuffle from "lodash.shuffle";

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
				if(idx === 12) {
					contents = "Free";
				} else if(idx > 12) {
					contents = this.props.phrases[idx - 1].phrase;
				} else {
					contents = this.props.phrases[idx].phrase;
				}

				let classes = "bingo-tile";
				if(this.props.bingoCells.indexOf(key) !== -1) {
					classes += " bingo-cell";
				} else if(key in this.props.clickedCells) {
					classes += " cell-clicked";
				}

				cells.push(<td key={key} data-key={key} className={classes}
					onClick={() => this.props.handleCellClicked(key)}>
					<span>{ contents }</span>
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
 * @param {string[]} arr
 * @param {number} size
 * @returns {string[]}
 */
function randomSubset(arr: string[], size: number): string[] {
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
	phrases: any[];
	onBack: any;
}

interface IBingoCardState {
	subset: any[];
	clickedCells: any;
	bingoCells: any[];
	isBingo: boolean;
	subsetHash: string;
	genSeed: number;
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
		};

		this.resetClicked = this.resetClicked.bind(this);
		this.onCellClicked = this.onCellClicked.bind(this);
		this.onGenClick = this.onGenClick.bind(this);
	}

	/**
	 * @param {string} key 2 chars: name of column + 1-indexed row
	 */
	onCellClicked(key: string) {
		if(!(key in this.state.clickedCells)) {
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

			this.setState({
				clickedCells: clickedCells,
				bingoCells: bingoCells,
				isBingo: isBingo
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
			isBingo: false
		});
	}

	render(): JSX.Element {
		return (<div id="grid-wrapper">
			<button className="btn btn-success" type="button" id="back-to-phrases-btn"
				onClick={ this.props.onBack }>Back to phrases</button>
			{this.state.isBingo ?
				<img src="img/bingo.gif" /> :
				<BingoGrid phrases={this.state.subset}
					clickedCells={this.state.clickedCells}
					bingoCells={this.state.bingoCells}
					handleCellClicked={this.onCellClicked} />
			}

			{this.state.isBingo ? null :
				<button className="btn btn-warning btn reset-clicked-cells-btn" type="button"
					onClick={this.resetClicked}>Reset Clicked Cells</button>}
			<button className="btn btn-primary btn gen-grid-btn" type="button"
				onClick={ this.onGenClick }>Generate New Grid</button>
		</div>);
	}
}
